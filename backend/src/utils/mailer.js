const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (email, code) => {
  try {
    await transporter.sendMail({
      from: `"InfieldHub Support" <${process.env.SMTP_USER || 'noreply@infieldhub.com'}>`,
      to: email,
      subject: 'Your InfieldHub Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #0D2B4E;">Verify Your Email</h2>
          <p>Thank you for registering with InfieldHub.</p>
          <p>Your 6-digit verification code is:</p>
          <h1 style="color: #1E88E5; letter-spacing: 5px; font-size: 32px;">${code}</h1>
          <p>This code expires in 15 minutes.</p>
        </div>
      `,
    });
    console.log(`✅ Email sent successfully to ${email}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    // Fallback: Log to console if email fails (so you can still test)
    console.log(`⚠️ FALLBACK VERIFICATION CODE FOR ${email}: ${code}`);
  }
};

module.exports = { sendVerificationEmail };
