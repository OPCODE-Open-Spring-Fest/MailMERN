const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const secure = (process.env.SMTP_SECURE === 'true') || port === 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  const transportOptions = {
    host,
    port,
    secure,
    logger: process.env.SMTP_DEBUG === 'true' || false,
    debug: process.env.SMTP_DEBUG === 'true' || false,
    // default TLS behavior
    tls: {
      rejectUnauthorized: process.env.SMTP_ALLOW_INSECURE === 'true' ? false : true
    }
  };

  if (user && pass) {
    transportOptions.auth = { user, pass };
  }

  const transporter = nodemailer.createTransport(transportOptions);

  // Verifying transporter configuration
  (async () => {
    try {
      await transporter.verify();
      logger.info('Nodemailer transporter is configured and ready');
    } catch (err) {
      //  for debugging
      logger.warn('Nodemailer transporter verification failed:', err && (err.stack || err));
    }
  })();

  return transporter;
};

const transporter = createTransporter();

const sendEmail = async ({ to, subject, text, html, from }) => {
  if (!to) throw new Error('Recipient "to" is required');

  const mailOptions = {
    from: from || process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER,
    to,
    subject: subject || '(no subject)',
    text: text || undefined,
    html: html || undefined,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to} messageId=${info.messageId}`);
    return info;
  } catch (err) {
    logger.error('Failed to send email:', {
      message: err && (err.message || err.code || err),
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    // Re-throw the error for further handling
    throw err;
  }
};

module.exports = {
  sendEmail,
  // expose transporter for creating alternate transports
  transporter
};