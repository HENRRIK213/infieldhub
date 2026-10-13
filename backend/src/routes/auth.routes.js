const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const redis = require('../config/redis');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');
const { sendVerificationCode } = require('../utils/mailer');
const {
  logActivity,
  detectBruteForce,
  detectMultiLocationLogin,
} = require('../utils/security');
const { validatePassword } = require('../middleware/passwordPolicy');
const { auth } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;
  const ua = req.headers['user-agent'];

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await logActivity({
      action: 'LOGIN_FAILED',
      details: `Unknown: ${email}`,
      ip,
      userAgent: ua,
      severity: 'WARN',
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (!user.active) return res.status(403).json({ error: 'Account disabled' });
  if (user.lockedUntil && user.lockedUntil > new Date())
    return res.status(423).json({ error: 'Account locked' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: user.failedAttempts + 1 },
    });
    await logActivity({
      userId: user.id,
      action: 'LOGIN_FAILED',
      details: email,
      ip,
      userAgent: ua,
      severity: 'WARN',
    });
    await detectBruteForce(email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedAttempts: 0, lastLogin: new Date() },
  });

  if (user.role === 'ADMIN') {
    const token = signAccess({ id: user.id, role: user.role, email: user.email });
    const refresh = signRefresh({ id: user.id });
    await logActivity({
      userId: user.id,
      action: 'LOGIN',
      interface: 'web',
      details: 'Admin login',
      ip,
      userAgent: ua,
    });
    await detectMultiLocationLogin(user.id, ip);
    return res.json({
      token,
      refreshToken: refresh,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`2fa:${email}`, code, { EX: 5 * 60 });
  const sent = await sendVerificationCode(email, code);
  if (!sent) console.log(`[DEV] 2FA for ${email}: ${code}`);
  await logActivity({
    userId: user.id,
    action: 'LOGIN_2FA_SENT',
    interface: 'web',
    details: email,
    ip,
    userAgent: ua,
  });
  res.json({ requires2FA: true, email });
});

router.post('/verify-2fa', async (req, res) => {
  const { email, code } = req.body;
  const stored = await redis.get(`2fa:${email}`);
  if (!stored || stored !== code) return res.status(401).json({ error: 'Invalid or expired code' });
  await redis.del(`2fa:${email}`);
  const user = await prisma.user.findUnique({ where: { email } });
  const token = signAccess({ id: user.id, role: user.role, email: user.email });
  const refresh = signRefresh({ id: user.id });
  await logActivity({
    userId: user.id,
    action: 'LOGIN_2FA_VERIFIED',
    interface: 'web',
    details: email,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  res.json({
    token,
    refreshToken: refresh,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  });
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = verifyRefresh(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new Error();
    res.json({ token: signAccess({ id: user.id, role: user.role, email: user.email }) });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) return res.status(401).json({ error: 'Current password incorrect' });
  const errors = validatePassword(newPassword);
  if (errors.length) return res.status(400).json({ error: 'Password policy', details: errors });
  if ((user.passwordHistory || []).some((h) => bcrypt.compareSync(newPassword, h)))
    return res.status(400).json({ error: 'Cannot reuse last 5 passwords' });

  const hashed = await bcrypt.hash(newPassword, 10);
  const history = [user.password, ...(user.passwordHistory || [])].slice(0, 5);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, passwordHistory: history },
  });
  await logActivity({
    userId: user.id,
    action: 'PASSWORD_CHANGE',
    interface: 'web',
    details: 'Password updated',
    ip: req.ip,
  });
  res.json({ success: true });
});

module.exports = router;