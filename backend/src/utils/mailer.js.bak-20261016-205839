const nodemailer = require('nodemailer');

let transporter = null;
let emailConfigured = false;

// ============================================================
// Check credentials
// ============================================================
function checkCredentials() {
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '').trim();

  if (!user || !pass) {
    console.log('❌ EMAIL_USER or EMAIL_PASS missing in .env');
    return false;
  }
  if (!user.includes('@')) {
    console.log('❌ EMAIL_USER is not a valid email');
    return false;
  }
  return true;
}

// ============================================================
// Initialize Gmail transporter — FIXED for self-signed certs
// ============================================================
if (checkCredentials()) {
  const cleanUser = (process.env.EMAIL_USER || '').trim();
  const cleanPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '').trim();

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL on port 465 — bypasses many certificate issues
    auth: {
      user: cleanUser,
      pass: cleanPass,
    },
    tls: {
      // ⭐ FIX: Allow self-signed certificates from antivirus/proxy
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
    // ⭐ Additional timeout settings
    connectionTimeout: 20000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('\n═══════════════════════════════════════════════');
      console.error('❌ GMAIL SMTP VERIFICATION FAILED');
      console.error('   Error:', error.message);
      console.error('');
      console.error('   Possible causes:');
      console.error('   1. Wrong App Password');
      console.error('   2. Spaces in EMAIL_PASS');
      console.error('   3. 2-Step Verification not enabled');
      console.error('   4. Antivirus blocking port 465');
      console.error('   5. Corporate network blocking SMTP');
      console.error('═══════════════════════════════════════════════\n');
      emailConfigured = false;
    } else {
      console.log('\n═══════════════════════════════════════════════');
      console.log('✅ GMAIL SMTP VERIFIED — emails will be delivered');
      console.log(`   Sending from: ${cleanUser}`);
      console.log('═══════════════════════════════════════════════\n');
      emailConfigured = true;
    }
  });
}

// ============================================================
// Send email
// ============================================================
async function sendMail({ to, subject, html }) {
  if (!emailConfigured || !transporter) {
    console.log('⚠️  Email NOT sent — SMTP not configured');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`✅ Email delivered to ${to}`);
    console.log(`   Message ID: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`❌ Email send failed to ${to}:`);
    console.error('   ' + err.message);
    return false;
  }
}

// ============================================================
// HTML template
// ============================================================
const template = (title, body) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Inter,Arial,sans-serif;background:#F7FAFF">
  <div style="background:#0D2B4E;padding:40px 20px">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.2)">
      <div style="background:linear-gradient(135deg,#0D2B4E 0%,#1E88E5 100%);padding:28px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">InfieldHub</h1>
        <p style="color:#4FC3F7;margin:8px 0 0;font-size:10px;letter-spacing:0.2em;font-weight:700">
          SOLAR • ELECTRICAL • WATER
        </p>
      </div>
      <div style="padding:32px;color:#0D2B4E">
        <h2 style="color:#0D2B4E;font-size:20px;font-weight:800;margin:0 0 16px">${title}</h2>
        ${body}
      </div>
      <div style="background:#F7FAFF;padding:16px;text-align:center;font-size:11px;color:#64748b">
        © ${new Date().getFullYear()} Infield Engineering Ltd
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============================================================
// Send verification code
// ============================================================
exports.sendVerificationCode = async (to, code) => {
  const sent = await sendMail({
    to,
    subject: 'Your InfieldHub Verification Code',
    html: template(
      'Your Verification Code',
      `
        <p style="font-size:14px;line-height:1.6;color:#334155;margin:0 0 20px">
          Use the 6-digit code below to complete your verification:
        </p>
        <div style="background:#F0F7FF;border:2px dashed #1E88E5;border-radius:12px;padding:24px;text-align:center;margin:0 0 20px">
          <div style="font-size:42px;font-weight:900;letter-spacing:14px;color:#0D2B4E;font-family:'Courier New',monospace">
            ${code}
          </div>
        </div>
        <p style="font-size:13px;color:#64748b;margin:0">
          ⏱ This code expires in <b>30 minutes</b>.
        </p>
      `
    ),
  });

  if (!sent) {
    console.log('\n═══════════════════════════════════════════════');
    console.log(`📧 FALLBACK CODE for ${to}:  ${code}`);
    console.log('   (Check .env — email failed)');
    console.log('═══════════════════════════════════════════════\n');
  }

  return sent;
};

// ============================================================
// Payment confirmation
// ============================================================
exports.sendPaymentConfirmation = async (to, d) => {
  return sendMail({
    to,
    subject: 'Payment Confirmed — InfieldHub',
    html: template(
      'Payment Confirmed ✅',
      `
        <p style="font-size:14px;color:#334155">Your payment has been approved.</p>
        <table style="width:100%;font-size:14px;color:#334155;border-collapse:collapse;margin-top:16px">
          <tr><td style="padding:8px 0;color:#64748b">Reference:</td><td style="padding:8px 0;font-weight:700">${d.reference}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Amount:</td><td style="padding:8px 0;font-weight:700">KES ${Number(d.amount).toLocaleString()}</td></tr>
        </table>
      `
    ),
  });
};

// ============================================================
// Quotation email
// ============================================================
exports.sendQuotation = async (to, serial, total) => {
  return sendMail({
    to,
    subject: `Quotation ${serial} — InfieldHub`,
    html: template(
      'Your Quotation',
      `
        <p style="font-size:14px;color:#334155">Your quotation has been generated.</p>
        <p style="font-size:14px;color:#334155;margin-top:12px">
          <b>Serial:</b> ${serial}<br>
          <b>Total:</b> KES ${Number(total).toLocaleString()}
        </p>
      `
    ),
  });
};