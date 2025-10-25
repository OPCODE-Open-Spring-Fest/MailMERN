const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog'); // import model

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  try {
    // Sending mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@mailmern.local',
      to,
      subject,
      text,
      html,
    });

    // success
    await EmailLog.create({
      to,
      subject,
      status: 'sent',
      timestamp: new Date(),
    });

    return info;
  } catch (error) {
    // failure
    await EmailLog.create({
      to,
      subject,
      status: 'failed',
      timestamp: new Date(),
    });

    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };
