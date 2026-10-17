const nodemailer = require('nodemailer');

let transporter = null;
let emailConfigured = false;

function checkCredentials() {
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '').trim();

  if (!user || !pass) {
    console.log('Email NOT configured - EMAIL_USER or EMAIL_PASS missing');
    return false;
  }

  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
    });

    transporter.verify((err) => {
      if (err) {
        console.error('SMTP VERIFY FAILED:', err.message);
        console.error('   User:', user);
        console.error('   Pass length:', pass.length);
      } else {
        console.log('SMTP transporter ready (port 465, SSL)');
        emailConfigured = true;
      }
    });

    return true;
  } catch (err) {
    console.error('Failed to create transporter:', err.message);
    return false;
  }
}

async function sendMail({ to, subject, html }) {
  if (!transporter) {
    if (!checkCredentials()) return false;
    await new Promise((r) => setTimeout(r, 2000));
  }
  if (!transporter) return false;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log('Email delivered to ' + to + ' | id: ' + info.messageId);
    return true;
  } catch (err) {
    console.error('sendMail FAILED:', err.message);
    return false;
  }
}

function verificationEmailHtml(code) {
  return [
    '<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#F7FAFF;border-radius:16px;">',
    '  <div style="text-align:center;margin-bottom:24px;">',
    '    <h1 style="color:#0D2B4E;font-size:22px;margin:0;">InfieldHub</h1>',
    '    <p style="color:#64748b;font-size:12px;margin:6px 0 0;letter-spacing:0.1em;">SOLAR - ELECTRICAL - WATER</p>',
    '  </div>',
    '  <h2 style="color:#0D2B4E;font-size:18px;margin-bottom:8px;">Your Verification Code</h2>',
    '  <p style="color:#475569;font-size:14px;">Use the 6-digit code below to complete your verification:</p>',
    '  <div style="background:#fff;border:2px solid #1E88E5;border-radius:12px;padding:24px;text-align:center;margin:20px 0;">',
    '    <div style="font-size:36px;font-weight:800;letter-spacing:0.3em;color:#0D2B4E;font-family:monospace;">' + code + '</div>',
    '  </div>',
    '  <p style="color:#64748b;font-size:12px;">This code expires in <b>30 minutes</b>.</p>',
    '  <p style="color:#94a3b8;font-size:11px;margin-top:24px;text-align:center;">If you did not request this code, ignore this email.</p>',
    '</div>',
  ].join('\n');
}

exports.sendVerificationCode = async (to, code) => {
  return sendMail({
    to,
    subject: 'Your InfieldHub Verification Code',
    html: verificationEmailHtml(code),
  });
};

exports.sendQuotationEmail = async (to, quotation) => {
  return sendMail({
    to,
    subject: 'Your Quotation from InfieldHub',
    html: '<h2>Your Quotation</h2><pre>' + JSON.stringify(quotation, null, 2) + '</pre>',
  });
};

exports.sendInviteEmail = async (to, link) => {
  return sendMail({
    to,
    subject: 'You have been invited to InfieldHub',
    html: '<p>Click the link below to register:</p><a href="' + link + '">' + link + '</a>',
  });
};

exports.sendPasswordResetEmail = async (to, code) => {
  return sendMail({
    to,
    subject: 'InfieldHub Password Reset',
    html: '<p>Your password reset code is <b>' + code + '</b>. Expires in 30 minutes.</p>',
  });
};

exports.sendAdminNotification = async (to, event, message, meta) => {
  meta = meta || {};
  const rows = Object.keys(meta).map(function (k) {
    return '<tr><td style="padding:6px 10px;color:#64748b;font-size:12px;border-bottom:1px solid #F1F5F9;">' + k + '</td><td style="padding:6px 10px;font-size:13px;color:#0D2B4E;font-weight:600;border-bottom:1px solid #F1F5F9;">' + String(meta[k]) + '</td></tr>';
  }).join('');

  const html =
    '<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#F7FAFF;border-radius:16px;">' +
    '<div style="text-align:center;margin-bottom:20px;">' +
    '<h1 style="color:#0D2B4E;font-size:22px;margin:0;">InfieldHub</h1>' +
    '<p style="color:#64748b;font-size:11px;margin:4px 0 0;letter-spacing:0.1em;">ADMIN NOTIFICATION</p>' +
    '</div>' +
    '<div style="background:#fff;border-radius:12px;padding:20px;border-left:4px solid #1E88E5;">' +
    '<div style="font-size:11px;color:#1E88E5;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">' + event + '</div>' +
    '<div style="font-size:16px;color:#0D2B4E;font-weight:700;margin-top:8px;">' + message + '</div>' +
    '</div>' +
    '<table style="margin-top:16px;width:100%;border-collapse:collapse;">' + rows + '</table>' +
    '<p style="color:#94a3b8;font-size:11px;margin-top:20px;text-align:center;">Sent automatically by InfieldHub at ' + new Date().toLocaleString() + '</p>' +
    '</div>';

  return sendMail({
    to: to,
    subject: '[InfieldHub] ' + event + ' - ' + message,
    html: html,
  });
};
