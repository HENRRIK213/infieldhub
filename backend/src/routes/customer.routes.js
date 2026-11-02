const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const { sendVerificationCode } = require('../utils/mailer');
const { logActivity } = require('../utils/security');

const LINK_VALIDITY_MS = 6 * 60 * 60 * 1000;   // 6 hours
const CODE_TTL_MS      = 15 * 60 * 1000;       // 15 minutes
const SESSION_MS       = 6 * 60 * 60 * 1000;   // 6 hours

// ============================================================
// GENERATE LINK
// ============================================================
router.post('/link', auth, async (req, res) => {
  try {
    const token = uuid();
    const expiresAt = new Date(Date.now() + LINK_VALIDITY_MS);

    const link = await prisma.customerLink.create({
      data: { token, createdBy: req.user.id, expiresAt, active: true },
    });

    const url = `${process.env.FRONTEND_URL || 'https://infieldhub.vercel.app'}/customer/register/${token}`;
    await logActivity({
      userId: req.user.id,
      action: 'CUSTOMER_LINK_GENERATE',
      interface: 'web',
      details: 'Customer registration link generated',
      ip: req.ip,
    });

    res.json({ token, url, expiresAt, validHours: 6 });
  } catch (err) {
    console.error('❌ Link error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// VALIDATE LINK — fast, no auth, always returns quickly
// ============================================================
router.get('/link/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const link = await prisma.customerLink.findUnique({ where: { token } });

    if (!link) {
      return res.status(410).json({ error: 'Link not found', code: 'NOT_FOUND' });
    }
    if (!link.active) {
      return res.status(410).json({ error: 'Link inactive', code: 'INACTIVE' });
    }

    const remaining = new Date(link.expiresAt).getTime() - Date.now();
    if (remaining <= 0) {
      return res.status(410).json({ error: 'Link expired (6-hour limit)', code: 'EXPIRED' });
    }

    res.json({
      valid: true,
      expiresAt: link.expiresAt,
      remainingMs: remaining,
    });
  } catch (err) {
    console.error('❌ Validation error:', err);
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
});

// ============================================================
// SEND CODE
// ============================================================
router.post('/verify/send', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const token = typeof req.body.token === 'string' ? req.body.token : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !token) {
      return res.status(400).json({ error: 'Email and token required' });
    }

    const link = await prisma.customerLink.findUnique({ where: { token } });
    if (!link || !link.active) {
      return res.status(410).json({ error: 'Link invalid' });
    }
    if (new Date(link.expiresAt).getTime() <= Date.now()) {
      return res.status(410).json({ error: 'Link expired' });
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const session = await prisma.customerSession.create({
      data: { email, code, linkToken: token, expiresAt: new Date(Date.now() + CODE_TTL_MS) },
    });

    try {
      await sendVerificationCode(email, code);
    } catch (error) {
      await prisma.customerSession.delete({ where: { id: session.id } });
      console.error('Customer invitation email delivery failed:', error.code || error.name);
      return res.status(503).json({
        error: error.code === 'EMAIL_NOT_CONFIGURED'
          ? 'Email verification is not configured. Please contact the administrator.'
          : 'We could not deliver your verification email. Please try again later.',
      });
    }

    res.json({ success: true, emailSent: true, message: `Code sent to ${email}` });
  } catch (err) {
    console.error('Customer verification email request failed:', err.code || err.name);
    res.status(503).json({ error: 'Verification is temporarily unavailable. Please try again later.' });
  }
});

// ============================================================
// VERIFY → return 6-hour session
// ============================================================
router.post('/verify/confirm', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const code = typeof req.body.code === 'string' ? req.body.code : '';
    const token = typeof req.body.token === 'string' ? req.body.token : '';
    if (!email || !/^\d{6}$/.test(code) || !token) {
      return res.status(400).json({ error: 'Email, code, token required' });
    }

    const record = await prisma.customerSession.findFirst({
      where: { email, code, linkToken: token, verified: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) return res.status(401).json({ error: 'Code is invalid or expired. Request a new one.' });

    const link = await prisma.customerLink.findUnique({ where: { token } });
    if (!link || !link.active) return res.status(410).json({ error: 'Link invalid' });
    if (new Date(link.expiresAt).getTime() <= Date.now()) {
      return res.status(410).json({ error: 'Link expired' });
    }

    await prisma.customerSession.update({
      where: { id: record.id },
      data: { verified: true },
    });

    await prisma.customer.upsert({
      where: { email },
      update: { lastSeenAt: new Date() },
      create: { email, lastSeenAt: new Date() },
    });

    const sessionExpiresAt = Math.min(
      Date.now() + SESSION_MS,
      new Date(link.expiresAt).getTime()
    );

    console.log(`✅ Verified: ${email} — session ends ${new Date(sessionExpiresAt).toLocaleString()}`);

    await logActivity({
      action: 'CUSTOMER_VERIFIED',
      interface: 'customer',
      details: email,
      ip: req.ip,
    });

    res.json({
      success: true,
      sessionExpiresAt: new Date(sessionExpiresAt).toISOString(),
      sessionHours: 6,
    });
  } catch (err) {
    console.error('Customer verification failed:', err.code || err.name);
    res.status(500).json({ error: 'Could not verify the code. Please try again.' });
  }
});

// ============================================================
// PURGE old links
// ============================================================
router.delete('/purge', auth, requireAdmin, async (req, res) => {
  try {
    const result = await prisma.customerLink.deleteMany({});
    res.json({ deleted: result.count });
  } catch (error) {
    console.error('Customer link purge failed:', error.code || error.name);
    res.status(503).json({ error: 'Could not purge customer links' });
  }
});

module.exports = router;