const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Helper to generate a 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateCode();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
        verificationCode,
        verificationCodeExpires: codeExpires,
        isVerified: false
      }
    });

    // In a real app, send this code via email (e.g., Nodemailer, SendGrid, Resend)
    console.log(`📧 Verification code for ${email}: ${verificationCode}`);

    res.status(201).json({ message: 'User registered. Please verify your email.', email: user.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// VERIFY ROUTE
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });
    if (user.verificationCode !== code) return res.status(400).json({ error: 'Invalid code' });
    if (user.verificationCodeExpires < new Date()) return res.status(400).json({ error: 'Code expired' });

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, verificationCode: null, verificationCodeExpires: null }
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Server error during verification' });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    if (!user.isVerified) return res.status(403).json({ error: 'Please verify your email first' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
