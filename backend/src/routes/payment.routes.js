const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { notifyAdmin } = require('../utils/notify');

// Webhook for Kingdom Bank / Payment Gateways
router.post('/webhook', async (req, res) => {
  try {
    const { reference, amount, phone, status } = req.body;
    
    // In a real scenario, you would verify the signature from Kingdom Bank here
    
    // Save to DB
    const payment = await prisma.payment.create({
      data: { reference, amount: parseFloat(amount), customerPhone: phone, status: status || 'APPROVED' }
    });

    // Notify Admin
    notifyAdmin(prisma, 'payment.received', `Payment of KSH ${amount} received from ${phone}. Ref: ${reference}`, { reference, amount })
      .catch(() => {});

    res.status(200).json({ success: true, message: 'Payment recorded' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
