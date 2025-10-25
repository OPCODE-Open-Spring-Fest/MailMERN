const nodemailer = require('nodemailer');
const { sendEmail, transporter } = require('../utils/sendEmail');
const logger = require('../utils/logger');

//POST /api/emails/send
//Body: {to,subject,text,html,from}
exports.send = async (req, res) => {
  try {
    const { to, subject, text, html, from } = req.body;
    if (!to) return res.status(400).json({ success: false, error: 'Recipient "to" is required' });

    const info = await sendEmail({ to, subject, text, html, from });

    return res.status(200).json({
      success: true,
      message: 'Email sent',
      info: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      }
    });
  } catch (error) {
    //full error.message for debugging
    logger.error('Error in send email controller:', error && (error.stack || error));
    return res.status(500).json({
      success: false,
      error: error && (error.message || error)
    });
  }
};

//POST /api/emails/test
//Body optional: {to} provide in body or in .env
exports.test = async (req, res) => {
  try {
    const to = req.body?.to || process.env.EMAIL_TEST_TO || process.env.SMTP_USER || process.env.EMAIL_USER;
    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'No test recipient configured. Provide "to" in body or set EMAIL_TEST_TO/SMTP_USER/EMAIL_USER in env.'
      });
    }

    const subject = 'MailMERN — Test Email';
    const text = `MailMERN test email sent at ${new Date().toISOString()}`;
    const html = `<p>MailMERN test email sent at <strong>${new Date().toISOString()}</strong></p>`;

    const info = await sendEmail({ to, subject, text, html });

    return res.status(200).json({
      success: true,
      message: `Test email sent to ${to}`,
      info: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      }
    });
  } catch (error) {
    logger.error('Error in email test controller:', error && (error.stack || error));
    return res.status(500).json({
      success: false,
      error: error && (error.message || error)
    });
  }
};


 //POST /api/emails/test-ethereal
 //Creates a temporary Ethereal account and sends a test email there.useful to check sending code path without real SMTP credentials
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
    const text = `Ethereal test email sent at ${new Date().toISOString()}`;
    const html = `<p>Ethereal test email sent at <strong>${new Date().toISOString()}</strong></p>`;

    const info = await ethTransport.sendMail({
      from: process.env.EMAIL_FROM || `MailMERN <${testAccount.user}>`,
      to,
      subject,
      text,
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