const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  // This uses ethereal by default for local testing
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@mailmern.local',
    to,
    subject,
    text,
    html,
  });

  return info;
};

module.exports = { sendEmail };
