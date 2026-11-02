const nodemailer = require('nodemailer');

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    const error = new Error('Verification email delivery is not configured');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  const port = Number(process.env.EMAIL_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

async function sendVerificationEmail(email, code) {
  const transporter = createTransporter();
  const sender = process.env.EMAIL_FROM || `"InfieldHub" <${process.env.EMAIL_USER}>`;
  await transporter.sendMail({
    from: sender,
    to: email,
    subject: 'Your InfieldHub Verification Code',
    text: `Your InfieldHub verification code is ${code}. It expires in 15 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;text-align:center;background:#F8FAFC;border-radius:10px">
        <h2 style="color:#0D2B4E">Welcome to InfieldHub</h2>
        <p style="color:#475569">Use this one-time code to verify your email address:</p>
        <h1 style="color:#1E88E5;letter-spacing:5px;font-size:36px;margin:20px 0">${code}</h1>
        <p style="color:#64748b;font-size:12px">This code expires in 15 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
}

async function sendQuotation(email, serialNumber, total) {
  const transporter = createTransporter();
  const sender = process.env.EMAIL_FROM || `"InfieldHub" <${process.env.EMAIL_USER}>`;
  await transporter.sendMail({
    from: sender,
    to: email,
    subject: `InfieldHub quotation ${serialNumber}`,
    text: `Your quotation ${serialNumber} has been prepared. Total: KES ${Number(total).toLocaleString('en-KE')}.`,
    html: `<p>Your quotation <strong>${serialNumber}</strong> has been prepared.</p><p>Total: <strong>KES ${Number(total).toLocaleString('en-KE')}</strong></p>`,
  });
}

module.exports = {
  sendVerificationEmail,
  sendVerificationCode: sendVerificationEmail,
  sendQuotation,
};
