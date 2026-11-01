const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { auth } = require('../middleware/auth');
const { generateQuotationPDF } = require('../utils/pdf');
const { logActivity } = require('../utils/security');
const { sendQuotation } = require('../utils/mailer');
const crypto = require('crypto');

const serial = () =>
  `INF-${new Date().getFullYear()}-${crypto.randomInt(100000, 1000000)}`;

async function pickFeaturedProducts() {
  const products = await prisma.$queryRaw`
    SELECT "id", "name", "imageUrl"
    FROM "Product"
    WHERE "imageUrl" IS NOT NULL AND "imageUrl" <> ''
    ORDER BY RANDOM()
    LIMIT 3
  `;
  if (!products.length) return [];
  return Array.from({ length: 3 }, (_, index) => products[index % products.length]);
}

// ============================================================
// CREATE QUOTATION — Admin + Employee + Customer
// ============================================================
router.post('/', auth, async (req, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'No items provided' });
    }

    if (items.some((item) => !item || typeof item.id !== 'string')) {
      return res.status(400).json({ error: 'Every quotation item must reference a catalog product' });
    }

    const productIds = [...new Set(items.map((item) => item.id))];
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productById = new Map(products.map((product) => [product.id, product]));
    const quotationItems = items.map((item) => {
      const product = productById.get(item.id);
      const quantity = Number(item.quantity);
      if (!product) throw new Error('A selected product is no longer available. Refresh the catalog and try again.');
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Product quantities must be positive whole numbers');
      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity,
        vat: Boolean(product.vat),
      };
    });

    let subtotal = 0;
    let vatAmount = 0;

    quotationItems.forEach((it) => {
      const line = it.price * it.quantity;
      subtotal += line;
      if (it.vat) vatAmount += line * 0.16;
    });

    const total = subtotal + vatAmount;
    const quotationDraft = {
      serialNumber: serial(),
      customerName,
      customerEmail,
      customerPhone,
      items: quotationItems,
      subtotal,
      vatAmount,
      total,
      createdAt: new Date(),
    };
    const featuredProducts = await pickFeaturedProducts();
    const pdfUrl = await generateQuotationPDF(quotationDraft, featuredProducts);

    const quotation = await prisma.quotation.create({
      data: {
        serialNumber: quotationDraft.serialNumber,
        customerName,
        customerEmail,
        customerPhone,
        items: quotationItems,
        subtotal,
        vatAmount,
        total,
        createdBy: req.user.id,
        createdByRole: req.user.role,
        status: 'SENT',
      },
    });

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

    const featuredProducts = await pickFeaturedProducts();
    const pdfUrl = await generateQuotationPDF(q, featuredProducts);
    res.json({ pdfUrl });
  } catch (e) {
    console.error('PDF regenerate error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;