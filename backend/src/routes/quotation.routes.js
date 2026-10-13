const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { auth } = require('../middleware/auth');
const { generateQuotationPDF } = require('../utils/pdf');
const { logActivity } = require('../utils/security');
const { sendQuotation } = require('../utils/mailer');

const serial = () =>
  `INF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

// ============================================================
// CREATE QUOTATION — Admin + Employee + Customer
// ============================================================
router.post('/', auth, async (req, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'No items provided' });
    }

    let subtotal = 0;
    let vatAmount = 0;

    items.forEach((it) => {
      const line = Number(it.price) * Number(it.quantity);
      subtotal += line;
      if (it.vat) vatAmount += line * 0.16;
    });

    const total = subtotal + vatAmount;

    const quotation = await prisma.quotation.create({
      data: {
        serialNumber: serial(),
        customerName,
        customerEmail,
        customerPhone,
        items,
        subtotal,
        vatAmount,
        total,
        createdBy: req.user.id,
        createdByRole: req.user.role,
        status: 'SENT',
      },
    });

    // Generate PDF only for admin/employee
    let pdfUrl = null;
    if (req.user.role === 'ADMIN' || req.user.role === 'EMPLOYEE') {
      try {
        pdfUrl = await generateQuotationPDF(quotation);
      } catch (pdfErr) {
        console.error('PDF generation failed:', pdfErr.message);
      }
    }

    if (customerEmail) {
      try {
        await sendQuotation(customerEmail, quotation.serialNumber, total);
      } catch (e) {
        console.error('Quotation email failed:', e.message);
      }
    }

    req.app.get('io').to('admin-room').emit('quotation:new', quotation);

    await logActivity({
      userId: req.user.id,
      action: 'QUOTATION_CREATE',
      interface: req.user.role === 'CUSTOMER' ? 'customer' : 'web',
      details: `${quotation.serialNumber} — KES ${total}`,
      ip: req.ip,
    });

    res.json({ ...quotation, pdfUrl });
  } catch (e) {
    console.error('Quotation create error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// LIST QUOTATIONS
// ============================================================
router.get('/', auth, async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { createdBy: req.user.id };
    const quotations = await prisma.quotation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(quotations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// GET SINGLE QUOTATION
// ============================================================
router.get('/:id', auth, async (req, res) => {
  try {
    const q = await prisma.quotation.findUnique({ where: { id: req.params.id } });
    if (!q) return res.status(404).json({ error: 'Not found' });
    res.json(q);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// REGENERATE PDF — Admin + Employee ONLY
// ============================================================
router.post('/:id/pdf', auth, async (req, res) => {
  try {
    if (req.user.role === 'CUSTOMER') {
      return res.status(403).json({ error: 'Customers cannot download PDFs' });
    }
    const q = await prisma.quotation.findUnique({ where: { id: req.params.id } });
    if (!q) return res.status(404).json({ error: 'Not found' });

    const pdfUrl = await generateQuotationPDF(q);
    res.json({ pdfUrl });
  } catch (e) {
    console.error('PDF regenerate error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;