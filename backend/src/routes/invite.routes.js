const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const { sendVerificationCode } = require('../utils/mailer');
const { logActivity } = require('../utils/security');
const { validatePassword } = require('../middleware/passwordPolicy');

const pending = new Map();

// ⏱️ Employee link = 7 days
const INVITE_MS = 7 * 24 * 60 * 60 * 1000;
const CODE_MS = 30 * 60 * 1000;

// ============================================================
// ADMIN ONLY: Generate employee registration link
// ============================================================
router.post('/employee/generate', auth, requireAdmin, async (req, res) => {
  try {
    console.log(`\n👥 Employee invite request from ${req.user.email}`);

    const token = uuid();
    const expiresAt = new Date(Date.now() + INVITE_MS);

    await prisma.employeeInvite.create({
      data: { token, createdBy: req.user.id, expiresAt, active: true },
    });

    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/employee/register/${token}`;

    console.log(`   ✅ Created: ${url}`);
    console.log(`   Expires: ${expiresAt.toLocaleString()} (7 days)\n`);

    await logActivity({
      userId: req.user.id,
      action: 'EMPLOYEE_INVITE_GENERATE',
      interface: 'web',
      details: token,
      ip: req.ip,
    });

    res.json({ token, url, expiresAt, validDays: 7 });
  } catch (err) {
    console.error('❌ Employee invite error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// Verify link
// ============================================================
router.get('/employee/verify/:token', async (req, res) => {
  const invite = await prisma.employeeInvite.findUnique({
    where: { token: req.params.token },
  });
  if (!invite || !invite.active || invite.expiresAt < new Date()) {
    return res.status(410).json({ error: 'Registration link expired or used' });
  }
  res.json({ valid: true, expiresAt: invite.expiresAt });
});

// ============================================================
// Send code
// ============================================================
router.post('/employee/send-code', async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ error: 'Email and token required' });

    const invite = await prisma.employeeInvite.findUnique({ where: { token } });
    if (!invite || !invite.active || invite.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Link expired' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    pending.set(email.toLowerCase(), { code, token, expiresAt: Date.now() + CODE_MS });

    const sent = await sendVerificationCode(email, code);
    console.log(`📧 Employee code for ${email}: ${code} (sent=${sent})`);

    res.json({ success: true, emailSent: sent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// Register
// ============================================================
router.post('/employee/register', async (req, res) => {
  try {
    const { email, code, name, phone, password, token } = req.body;

    const record = pending.get(email.toLowerCase());
    if (!record) return res.status(401).json({ error: 'No code found' });
    if (record.code !== code) return res.status(401).json({ error: 'Incorrect code' });
    if (record.expiresAt < Date.now()) {
      pending.delete(email.toLowerCase());
      return res.status(401).json({ error: 'Code expired' });
    }
    if (record.token !== token) return res.status(401).json({ error: 'Token mismatch' });

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

    pending.delete(email.toLowerCase());

    await logActivity({
      userId: user.id,
      action: 'EMPLOYEE_REGISTERED',
      interface: 'web',
      details: email,
      ip: req.ip,
    });

    res.json({ success: true, userId: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;