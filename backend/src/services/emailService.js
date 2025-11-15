const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog'); // import your model

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || process.env.EMAIL,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.PASS,
  },
});

// Unified email sender that supports OTP and logs results
exports.sendEmail = async ({ to, otp, subject, text, html }) => {
  if (!to) throw new Error('Recipient email is required');

  try {
    // Default to OTP email if otp is provided
    const emailSubject = subject || 'Reset Your Password';
    const emailHtml =
      html ||
      `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`;
    const emailText = text || `Your OTP is ${otp}. It expires in 5 minutes.`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL,
      to,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    //  Log success
    await EmailLog.create({
      to,
      subject: emailSubject,
      status: 'sent',
      timestamp: new Date(),
    });

    console.log(' Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error(' Email sending failed:', error);

    //  Log failure
    await EmailLog.create({
      to,
      subject: subject || 'Unknown',
      status: 'failed',
      timestamp: new Date(),
    });

    throw error;
  }
};

