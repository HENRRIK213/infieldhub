const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { sendVerificationEmail } = require('../utils/mailer');
const router = express.Router();
const prisma = new PrismaClient();

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Customer Requests Code via Email
router.post('/customer-request-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    let user = await prisma.user.findUnique({ where: { email } });
    
    // If user doesn't exist, create them as a CUSTOMER with a random password
    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      user = await prisma.user.create({
        data: {
          email,
          password: randomPassword,
          role: 'CUSTOMER',
          name: email.split('@')[0], // Default name
          isVerified: false
        }
      });
    }

    const code = generateCode();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { verificationCode: code, verificationCodeExpires: codeExpires, isVerified: false }
    });

    await sendVerificationEmail(email, code);
    res.json({ message: 'Code sent to email', email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error sending code' });
  }
});

// 2. Customer Verifies Code (Logs them in)
router.post('/customer-verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verificationCode !== code) return res.status(400).json({ error: 'Invalid code' });
    if (user.verificationCodeExpires < new Date()) return res.status(400).json({ error: 'Code expired' });

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, verificationCode: null, verificationCodeExpires: null }
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '6h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Server error verifying code' });
  }
});

// Keep existing login for Admin/Employees
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    if (user.role === 'CUSTOMER') return res.status(403).json({ error: 'Customers must use email login link' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '6h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;