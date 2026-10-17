const { sendAdminSMS } = require('./sms');
const mailer = require('./mailer');

async function notifyAdmin(prisma, event, message, meta) {
  meta = meta || {};
  const result = { log: false, sms: false, email: false };
  console.log('[NOTIFY] ' + event + ' - ' + message);

  // 1) Activity log
  if (prisma && prisma.activityLog && typeof prisma.activityLog.create === 'function') {
    try {
      await prisma.activityLog.create({
        data: { category: event, message: message, meta: JSON.stringify(meta) },
      });
      result.log = true;
    } catch (e) {}
  }

  // 2) SMS
  try {
    const smsRes = await sendAdminSMS('[InfieldHub] ' + message);
    result.sms = !!(smsRes && smsRes.ok);
  } catch (e) {
    console.error('[NOTIFY] SMS failed: ' + e.message);
  }

  // 3) Email
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (adminEmail && mailer && typeof mailer.sendAdminNotification === 'function') {
      const ok = await mailer.sendAdminNotification(adminEmail, event, message, meta);
      result.email = !!ok;
    }
  } catch (e) {
    console.error('[NOTIFY] Email failed: ' + e.message);
  }

  return result;
}

module.exports = { notifyAdmin: notifyAdmin };
