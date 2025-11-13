const { sendEmail } = require('../utils/SendEmail');
const EmailEvent = require('../models/EmailEvent');
const Campaign = require('../models/Campaign');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const processBatch = async (batch, campaignId, startIndex, html, text, subject, baseUrl) => {
  const results = await Promise.allSettled(
    batch.map(async (recipient, batchIndex) => {
      const index = startIndex + batchIndex;
      try {
        const emailId = new mongoose.Types.ObjectId();

        //email content
        let personalizedHtml = html || '';
        let personalizedText = text || '';
        
        if (recipient.name) {
          personalizedHtml = personalizedHtml.replace(/\{\{name\}\}/g, recipient.name);
          personalizedText = personalizedText.replace(/\{\{name\}\}/g, recipient.name);
        }
        const trackedHtml = `
          ${personalizedHtml}
          <img src="${baseUrl}/api/track/open/${emailId}.png" width="1" height="1" style="display:none;" />
        `;

        // Send email
        await sendEmail({
          to: recipient.email,
          subject: subject,
          html: trackedHtml,
          text: personalizedText
        });

        // Create email event
        await EmailEvent.create({
          _id: emailId,
          email: recipient.email,
          subject: subject,
          status: 'sent',
          messageId: emailId.toString(),
          eventType: 'sent',
          createdAt: new Date()
        });
        await Campaign.updateOne(
          { _id: campaignId, 'recipients.email': recipient.email },
          {
            $set: {
              'recipients.$.status': 'sent',
              'recipients.$.sentAt': new Date()
            }
          }
        );

        return { success: true, email: recipient.email };
      } catch (error) {
        logger.error(`Failed to send email to ${recipient.email}:`, error);
      
        await Campaign.updateOne(
          { _id: campaignId, 'recipients.email': recipient.email },
          {
            $set: {
              'recipients.$.status': 'failed',
              'recipients.$.error': error.message || 'Unknown error'
            }
          }
        );

        return { success: false, email: recipient.email, error: error.message };
      }
    })
  );

  return results;
};
exports.sendBulkEmails = async (campaignData, recipients) => {
  const { name, subject, html, text, userId } = campaignData;
  
  //campaign record
  const campaign = await Campaign.create({
    name,
    subject,
    html,
    text,
    userId: userId || null,
    status: 'pending',
    totalRecipients: recipients.length,
    recipients: recipients.map(r => ({
      email: r.email,
      name: r.name || '',
      status: 'pending'
    }))
  });
  campaign.status = 'processing';
  campaign.startedAt = new Date();
  await campaign.save();

  processBulkEmailsAsync(campaign, recipients, html, text, subject);

  return {
    campaignId: campaign._id,
    status: 'processing',
    totalRecipients: recipients.length,
    message: 'Campaign started. Emails are being sent in the background.'
  };
};

const processBulkEmailsAsync = async (campaign, recipients, html, text, subject) => {
  const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE) || 10;
  const delayBetweenBatches = parseInt(process.env.EMAIL_BATCH_DELAY) || 1000;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const campaignId = campaign._id;
  
  let sentCount = 0;
  let failedCount = 0;
  const errors = [];

  try {
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const results = await processBatch(batch, campaignId, i, html, text, subject, baseUrl);
      results.forEach((result, batchIndex) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            sentCount++;
          } else {
            failedCount++;
            if (result.value.error) {
              errors.push(`${result.value.email}: ${result.value.error}`);
            }
          }
        } else {
          failedCount++;
          const email = batch[batchIndex]?.email || 'unknown';
          errors.push(`${email}: ${result.reason?.message || 'Unknown error'}`);
        }
      });
      const updatedCampaign = await Campaign.findById(campaignId);
      if (!updatedCampaign) {
        throw new Error('Campaign not found');
      }

      const totalProcessed = sentCount + failedCount;
      updatedCampaign.progress = Math.round((totalProcessed / updatedCampaign.totalRecipients) * 100);
      updatedCampaign.sentCount = sentCount;
      updatedCampaign.failedCount = failedCount;
      updatedCampaign.errors = errors.slice(0, 100); 

      await updatedCampaign.save();

      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    const finalCampaign = await Campaign.findById(campaignId);
    if (!finalCampaign) {
      throw new Error('Campaign not found');
    }

    finalCampaign.status = failedCount === finalCampaign.totalRecipients ? 'failed' : 'completed';
    finalCampaign.completedAt = new Date();
    finalCampaign.progress = 100;
    finalCampaign.sentCount = sentCount;
    finalCampaign.failedCount = failedCount;
    await finalCampaign.save();

    logger.info(`Campaign ${campaignId} completed: ${sentCount} sent, ${failedCount} failed`);

  } catch (error) {
    logger.error(`Campaign ${campaignId} failed:`, error);
    const failedCampaign = await Campaign.findById(campaignId);
    if (failedCampaign) {
      failedCampaign.status = 'failed';
      failedCampaign.errors.push(`Campaign error: ${error.message}`);
      await failedCampaign.save();
    }
  }
};

exports.getCampaignStatus = async (campaignId) => {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    throw new Error('Campaign not found');
  }
  return campaign;
};

exports.getUserCampaigns = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const query = userId ? { userId } : {};
  
  const [campaigns, total] = await Promise.all([
    Campaign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-recipients -html -text') 
      .lean(),
    Campaign.countDocuments(query)
  ]);

  return {
    campaigns,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

