const { sendAdminSMS } = require('./sms');

/**
 * Notify admin: always logs, always saves to activity, and SMS-es if enabled.
 * @param {Object} prisma - Prisma client
 * @param {string} event - short event code e.g. "payment.approved"
 * @param {string} message - human-readable
 * @param {Object} meta - extra data to save
 */
async function notifyAdmin(prisma, event, message, meta = {}) {
  try {
    console.log('[NOTIFY]', event, '-', message);

    // Persist activity log if model exists
    if (prisma && prisma.activityLog && prisma.activityLog.create) {
      try {
        await prisma.activityLog.create({
          data: { category: event, message, meta: JSON.stringify(meta) },
        });
      } catch (e) {
        // ignore if schema differs
      }
    }

    // SMS
    const res = await sendAdminSMS(`[InfieldHub] ${message}`);
    return { inApp: true, sms: res.ok };
  } catch (err) {
    console.error('[NOTIFY] failed:', err.message);
    return { inApp: false, sms: false };
  }
}

module.exports = { notifyAdmin };
