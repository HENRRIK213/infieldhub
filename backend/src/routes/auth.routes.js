const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    // STRICT ADMIN CHECK
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Only Administrators can log in here. Employees must use their invite link.' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '6h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('LOGIN ERROR:', error); 
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;