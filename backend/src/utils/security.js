const prisma = require('../config/db');

exports.logActivity = async ({
  userId,
  action,
  interface: iface,
  details,
  ip,
  userAgent,
  severity = 'INFO',
}) => {
  try {
    await prisma.log.create({
      data: { userId, action, interface: iface, details, ip, userAgent, severity },
    });
  } catch (e) {
    console.error('Log error:', e.message);
  }
};

exports.createAlert = (type, message, severity = 'MEDIUM') =>
  prisma.securityAlert.create({ data: { type, message, severity } });

exports.detectBruteForce = async (email) => {
  const since = new Date(Date.now() - 5 * 60 * 1000);
  const count = await prisma.log.count({
    where: { action: 'LOGIN_FAILED', details: { contains: email }, createdAt: { gte: since } },
  });
  if (count >= 5) {
    await exports.createAlert('BRUTE_FORCE', `Multiple failed logins for ${email}`, 'HIGH');
    return true;
  }
  return false;
};

exports.detectUnusualActivity = async (userId) => {
  const since = new Date(Date.now() - 10 * 60 * 1000);
  const count = await prisma.log.count({ where: { userId, createdAt: { gte: since } } });
  if (count > 100) {
    await exports.createAlert(
      'UNUSUAL_ACTIVITY',
      `User ${userId} performed ${count} actions in 10min`,
      'MEDIUM'
    );
    return true;
  }
  return false;
};

exports.detectMultiLocationLogin = async (userId, ip) => {
  const last = await prisma.log.findFirst({
    where: { userId, action: 'LOGIN' },
    orderBy: { createdAt: 'desc' },
  });
  if (last && last.ip && last.ip !== ip) {
    const diff = Date.now() - new Date(last.createdAt).getTime();
    if (diff < 5 * 60 * 1000)
      await exports.createAlert(
        'MULTI_LOCATION',
        `User ${userId} logged in from different IP within 5min`,
        'HIGH'
      );
  }
};