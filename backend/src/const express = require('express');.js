const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');
const router = express.Router();
const prisma = new PrismaClient();
const { auth } = require('../middleware/auth');
const { sendVerificationCode } = require('../utils/mailer');
const { logActivity } = require('../utils/security');

const codes = new Map();

// 7 days link validity — same as employee registration
const LINK_DAYS = 7;
const LINK_MS = LINK_DAYS * 24 * 60 * 60 * 1000;
const CODE_MS = 30 * 60 * 1000;      // 30 minutes
const SESSION_MS = 6 * 60 * 60 * 1000; // 6 hours

// ============================================================
// GENERATE LINK — 7 days
// ============================================================
router.post('/link', auth, async (req, res) => {
  try {
    const token = uuid();
    const expiresAt = new Date(Date.now() + LINK_MS);

    const link = await prisma.customerLink.create({
      data: { token, createdBy: req.user.id, expiresAt, active: true },
    });

    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/customer/${token}`;

    console.log(`\n🔗 LINK CREATED`);
    console.log(`   URL:     ${url}`);
    console.log(`   Expires: ${expiresAt.toLocaleString()} (7 days)\n`);

    await logActivity({
      userId: req.user.id,
      action: 'CUSTOMER_LINK_GENERATE',
      interface: 'web',
      details: token,
      ip: req.ip,
    });

    res.json({ token, url, expiresAt, validDays: LINK_DAYS });
  } catch (err) {
    console.error('Link error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// VALIDATE
// ============================================================
router.get('/link/:token', async (req, res) => {
  try {
    const link = await prisma.customerLink.findUnique({
      where: { token: req.params.token },
    });

    if (!link) return res.status(410).json({ error: 'Link not found' });
    if (!link.active) return res.status(410).json({ error: 'Link inactive' });
    if (new Date(link.expiresAt).getTime() <= Date.now()) {
      return res.status(410).json({ error: 'Link expired' });
    }

    res.json({
      valid: true,
      expiresAt: link.expiresAt,
      hoursLeft: Math.round((new Date(link.expiresAt).getTime() - Date.now()) / 3600000),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// PURGE — clears all old links (run this once if links keep failing)
// ============================================================
router.delete('/purge', async (req, res) => {
  const r = await prisma.customerLink.deleteMany({});
  res.json({ deleted: r.count });
});

// ============================================================
// SEND CODE
// ============================================================
router.post('/verify/send', async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ error: 'Email and token required' });

    const link = await prisma.customerLink.findUnique({ where: { token } });
    if (!link || !link.active || new Date(link.expiresAt).getTime() <= Date.now()) {
      return res.status(410).json({ error: 'Link invalid or expired' });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    codes.set(email.toLowerCase(), { code, token, expiresAt: Date.now() + CODE_MS });

    await prisma.customerSession.create({
      data: { email, code, linkToken: token, expiresAt: new Date(Date.now() + CODE_MS) },
    });

    const sent = await sendVerificationCode(email, code);

    console.log(`\n📧 CODE for ${email}: ${code}\n`);

    res.json({
      success: true,
      emailSent: sent,
      message: sent ? `Code sent to ${email}` : `Check backend terminal for code`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// VERIFY → create session
// ============================================================
router.post('/verify/confirm', async (req, res) => {
  try {
    const { email, code, token } = req.body;
    if (!email || !code || !token) {
      return res.status(400).json({ error: 'Email, code and token required' });
    }

    const record = codes.get(email.toLowerCase());
    if (!record) return res.status(401).json({ error: 'No code found' });
    if (record.code !== code) return res.status(401).json({ error: 'Incorrect code' });
    if (record.expiresAt < Date.now()) {
      codes.delete(email.toLowerCase());
      return res.status(401).json({ error: 'Code expired' });
    }

    const link = await prisma.customerLink.findUnique({ where: { token } });
    if (!link || !link.active || new Date(link.expiresAt).getTime() <= Date.now()) {
      return res.status(410).json({ error: 'Link invalid or expired' });
    }

    await prisma.customerSession.updateMany({
      where: { email, linkToken: token, code },
      data: { verified: true },
    });

    await prisma.customer.upsert({
      where: { email },
      update: { lastSeenAt: new Date() },
      create: { email, lastSeenAt: new Date() },
    });

    codes.delete(email.toLowerCase());

    const sessionExpiresAt = new Date(Date.now() + SESSION_MS);

    console.log(`\n✅ VERIFIED: ${email}\n   Session ends: ${sessionExpiresAt.toLocaleString()}\n`);

    await logActivity({
      action: 'CUSTOMER_VERIFIED',
      interface: 'customer',
      details: email,
      ip: req.ip,
    });

    res.json({
      success: true,
      sessionExpiresAt: sessionExpiresAt.toISOString(),
      sessionHours: 6,
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;