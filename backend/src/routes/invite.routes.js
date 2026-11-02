const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');
const crypto = require('crypto');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const { sendVerificationCode } = require('../utils/mailer');
const { logActivity } = require('../utils/security');
const { validatePassword } = require('../middleware/passwordPolicy');

// ⏱️ Employee link = 7 days
const INVITE_MS = 7 * 24 * 60 * 60 * 1000;
const CODE_MS = 30 * 60 * 1000;

// ============================================================
// ADMIN ONLY: Generate employee registration link
// ============================================================
router.post('/employee/generate', auth, requireAdmin, async (req, res) => {
  try {
    const token = uuid();
    const expiresAt = new Date(Date.now() + INVITE_MS);

    await prisma.employeeInvite.create({
      data: { token, createdBy: req.user.id, expiresAt, active: true },
    });

    const url = `${process.env.FRONTEND_URL || 'https://infieldhub.vercel.app'}/employee/register/${token}`;

    await logActivity({
      userId: req.user.id,
      action: 'EMPLOYEE_INVITE_GENERATE',
      interface: 'web',
      details: 'Employee registration link generated',
      ip: req.ip,
    });

    res.json({ token, url, expiresAt, validDays: 7 });
  } catch (err) {
    console.error('Employee invite creation failed:', err.code || err.name);
    res.status(503).json({ error: 'Could not create an employee invitation' });
  }
});

// ============================================================
// Verify link
// ============================================================
router.get('/employee/verify/:token', async (req, res) => {
  try {
    const invite = await prisma.employeeInvite.findUnique({
      where: { token: req.params.token },
    });
    if (!invite || !invite.active || invite.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Registration link expired or used' });
    }
    res.json({ valid: true, expiresAt: invite.expiresAt });
  } catch (error) {
    console.error('Employee invite validation failed:', error.code || error.name);
    res.status(503).json({ error: 'Could not validate this registration link' });
  }
});

// ============================================================
// Send code
// ============================================================
router.post('/employee/send-code', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const token = typeof req.body.token === 'string' ? req.body.token : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !token) {
      return res.status(400).json({ error: 'A valid email and invitation token are required' });
    }

    const invite = await prisma.employeeInvite.findUnique({ where: { token } });
    if (!invite || !invite.active || invite.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Link expired' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const code = String(crypto.randomInt(100000, 1000000));
    const session = await prisma.customerSession.create({
      data: { email, code, linkToken: token, expiresAt: new Date(Date.now() + CODE_MS) },
    });
    try {
      await sendVerificationCode(email, code);
    } catch (error) {
      await prisma.customerSession.delete({ where: { id: session.id } });
      throw error;
    }
    res.json({ success: true, emailSent: true });
  } catch (err) {
    console.error('Employee verification email request failed:', err.code || err.name);
    res.status(503).json({
      error: err.code === 'EMAIL_NOT_CONFIGURED'
        ? 'Email verification is not configured. Please contact the administrator.'
        : 'We could not deliver your verification email. Please try again later.',
    });
  }
});

// ============================================================
// Register
// ============================================================
router.post('/employee/register', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const code = typeof req.body.code === 'string' ? req.body.code : '';
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const token = typeof req.body.token === 'string' ? req.body.token : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code) || !token || !name) {
      return res.status(400).json({ error: 'Name, valid email, 6-digit code, and invitation are required' });
    }

    const record = await prisma.customerSession.findFirst({
      where: {
        email,
        code,
        linkToken: token,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) return res.status(401).json({ error: 'Code is invalid or expired. Request a new one.' });

    const errors = validatePassword(password);
    if (errors.length) return res.status(400).json({ error: 'Password policy', details: errors });

    const invite = await prisma.employeeInvite.findUnique({ where: { token } });
    if (!invite || !invite.active || invite.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Link expired' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, phone, role: 'EMPLOYEE', active: true },
    });

    await prisma.employeeInvite.update({
      where: { id: invite.id },
      data: { usedBy: user.id, active: false },
    });

    await prisma.customerSession.deleteMany({ where: { email, linkToken: token } });

    await logActivity({
      userId: user.id,
      action: 'EMPLOYEE_REGISTERED',
      interface: 'web',
      details: email,
      ip: req.ip,
    });

    res.json({ success: true, userId: user.id, email: user.email });
  } catch (err) {
    console.error('Employee registration failed:', err.code || err.name);
    res.status(503).json({ error: 'Could not complete employee registration' });
  }
});

module.exports = router;