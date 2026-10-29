const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, code) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"InfieldHub" <noreply@infieldhub.com>',
      to: email,
      subject: 'Your InfieldHub Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #F8FAFC; border-radius: 10px;">
          <h2 style="color: #0D2B4E;">Welcome to InfieldHub</h2>
          <p style="color: #475569;">Please use the following 6-digit code to verify your email address and access your catalog:</p>
          <h1 style="color: #1E88E5; letter-spacing: 5px; font-size: 36px; margin: 20px 0;">${code}</h1>
          <p style="color: #64748b; font-size: 12px;">This code will expire in 15 minutes.</p>
        </div>
      `,
    });
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Fallback so you can still test if email fails
    console.log(`⚠️ FALLBACK VERIFICATION CODE FOR ${email}: ${code}`);
  }
};

module.exports = { sendVerificationEmail };