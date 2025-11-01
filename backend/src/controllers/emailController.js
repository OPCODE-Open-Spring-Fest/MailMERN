const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/SendEmail');
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const EmailEvent = require('../models/EmailEvent');

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
