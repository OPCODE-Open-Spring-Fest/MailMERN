const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/SendEmail');
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const EmailEvent = require('../models/EmailEvent');
const { sendBulkEmails, getCampaignStatus, getUserCampaigns } = require('../services/bulkEmailService');
const csvParser = require('csv-parser');
const { Readable } = require('stream');

// POST /api/emails/send
// Body: { to, subject, text, html, from }
exports.send = async (req, res) => {
  try {
    const { to, subject, text, html, from } = req.body;
    if (!to) {
      return res.status(400).json({ success: false, error: 'Recipient "to" is required' });
    }

    // create unique emailId for tracking
    const emailId = new mongoose.Types.ObjectId();

    // ensure base URL is defined
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    // inject tracking pixel and link into HTML body
    const trackedHtml = `
      ${html || ''}
      <img src="${baseUrl}/api/track/open/${emailId}.png" width="1" height="1" style="display:none;" />
      <p><a href="${baseUrl}/api/track/click/${emailId}?redirect=https://mailmern.vercel.app">Click here</a></p>
    `;

    // send email through configured transporter
    const info = await sendEmail({ to, subject, text, html: trackedHtml, from });

    // store initial record in database
    await EmailEvent.create({
      _id: emailId,
      recipient: to,
      subject,
      status: 'sent',
      createdAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Email sent (with tracking)',
      info: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      },
      emailId
    });
  } catch (error) {
    logger.error('Error in send email controller:', error && (error.stack || error));
    return res.status(500).json({
      success: false,
      error: error && (error.message || error)
    });
  }
};

// POST /api/emails/test
exports.test = async (req, res) => {
  try {
    const to =
      req.body?.to ||
      process.env.EMAIL_TEST_TO ||
      process.env.SMTP_USER ||
      process.env.EMAIL_USER;
    if (!to) {
      return res.status(400).json({
        success: false,
        error:
          'No test recipient configured. Provide "to" in body or set EMAIL_TEST_TO/SMTP_USER/EMAIL_USER in env.'
      });
    }

    const subject = 'MailMERN — Test Email (Tracked)';
    const html = `<p>Hello! This is a MailMERN tracking test email.</p>`;

    const emailId = new mongoose.Types.ObjectId();
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    const trackedHtml = `
      ${html}
      <img src="${baseUrl}/api/track/open/${emailId}.png" width="1" height="1" style="display:none;" />
      <p><a href="${baseUrl}/api/track/click/${emailId}?redirect=https://mailmern.vercel.app">Click here</a></p>
    `;

    const info = await sendEmail({ to, subject, html: trackedHtml });

    await EmailEvent.create({
      _id: emailId,
      recipient: to,
      subject,
      status: 'sent',
      createdAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: `Test tracked email sent to ${to}`,
      info,
      emailId
    });
  } catch (error) {
    logger.error('Error in email test controller:', error && (error.stack || error));
    return res.status(500).json({
      success: false,
      error: error && (error.message || error)
    });
  }
};

// POST /api/emails/test-ethereal
exports.testEthereal = async (req, res) => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const ethTransport = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const to = req.body?.to || process.env.EMAIL_TEST_TO || 'recipient@example.com';
    const subject = 'MailMERN — Ethereal Test Email';
    const html = `<p>Ethereal test email sent at <strong>${new Date().toISOString()}</strong></p>`;

    const info = await ethTransport.sendMail({
      from: process.env.EMAIL_FROM || `MailMERN <${testAccount.user}>`,
      to,
      subject,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    return res.status(200).json({
      success: true,
      message: `Ethereal test email sent (preview available)`,
      info: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
        previewUrl
      },
      ethereal: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (error) {
    logger.error('Error in ethereal test controller:', error && (error.stack || error));
    return res.status(500).json({
      success: false,
      error: error && (error.message || error)
    });
  }
};

// POST /api/emails/bulk-send
exports.bulkSend = async (req, res) => {
  try {
    const { name, subject, html, text } = req.body;
    let recipients = [];

    if (req.file && req.file.buffer) {
      recipients = await parseCSVFile(req.file.buffer);
    } else if (req.body.recipients) {
      try {
        recipients = typeof req.body.recipients === 'string' 
          ? JSON.parse(req.body.recipients) 
          : req.body.recipients;
      } catch (e) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid recipients format. Expected JSON array or CSV file.' 
        });
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Either CSV file or recipients array is required' 
      });
    }

    if (!name || !subject) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campaign name and subject are required' 
      });
    }
    if (!html && !text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Either HTML or text content is required' 
      });
    }
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No valid recipients found in CSV or recipients array' 
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validRecipients = recipients.filter(r => {
      if (!r.email || !emailRegex.test(r.email)) {
        logger.warn(`Invalid email address: ${r.email}`);
        return false;
      }
      return true;
    });
    if (validRecipients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No valid email addresses found' 
      });
    }

    const userId = req.user?.id || null;

    // Send bulk emails
    const result = await sendBulkEmails(
      { name, subject, html, text, userId },
      validRecipients
    );
    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Error in bulk send controller:', error && (error.stack || error));
    return res.status(500).json({
      success: false,
      error: error && (error.message || error)
    });
  }
};

//function to parse CSV
const parseCSVFile = (buffer) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    const stream = Readable.from(buffer.toString());
    
    stream
      .pipe(csvParser({ 
        skipLines: 0, 
        mapHeaders: ({ header }) => header && header.trim().toLowerCase() 
      }))
      .on('data', (row) => {
        const email = (row.email || row['e-mail'] || row['email address'] || '').toString().trim().toLowerCase();
        const name = (row.name || row['full name'] || row['fullname'] || row['first name'] || '').toString().trim();
        
        if (email) {
          rows.push({ email, name });
        }
      })
      .on('end', () => {
        resolve(rows);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

// GET /api/emails/campaign/:id
exports.getCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await getCampaignStatus(id);
    
    return res.status(200).json({
      success: true,
      campaign
    });
  } catch (error) {
    logger.error('Error getting campaign:', error && (error.stack || error));
    return res.status(500).json({
      success: false,
      error: error && (error.message || error)
    });
  }
};

// GET /api/emails/campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const userId = req.user?.id || null;
    
    const result = await getUserCampaigns(userId, page, limit);
    
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error getting campaigns:', error && (error.stack || error));
    return res.status(500).json({
      success: false,
      error: error && (error.message || error)
    });
  }
};