const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { auth } = require('../middleware/auth');
const { notifyAdmin } = require('../utils/notify');

// GET STATS (For the Dashboard Tracker)
router.get('/stats', auth, async (req, res) => {
  try {
    const allDocs = await prisma.document.findMany();
    const quotes = allDocs.filter(d => d.type === 'QUOTATION');
    const invoices = allDocs.filter(d => d.type === 'INVOICE');
    
    res.json({
      totalQuotes: quotes.length,
      totalInvoices: invoices.length,
      approvedQuotes: quotes.filter(d => d.status === 'APPROVED').length,
      pendingQuotes: quotes.filter(d => d.status === 'DRAFT' || d.status === 'SENT').length,
      recentDocs: allDocs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { type, title, clientName, clientPhone, content, total } = req.body;
    const prefix = type === 'QUOTATION' ? 'QT' : type === 'INVOICE' ? 'INV' : type === 'REPORT' ? 'RPT' : 'PSTR';
    const serialNo = prefix + '-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);

    const doc = await prisma.document.create({
      data: { type, title, clientName, clientPhone, content: JSON.stringify(content), total, serialNo, status: 'SENT' }
    });

    notifyAdmin(prisma, type.toLowerCase() + '.created', 'New ' + type + ' ' + serialNo + ' generated for ' + (clientName || 'Client') + ' (KES ' + (total || 0).toLocaleString() + ')', {
      serialNo, title, clientName, total
    }).catch(() => {});

    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const docs = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const { notifyAdmin } = require('../utils/notify');

// DELETE DOCUMENT
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const doc = await prisma.document.delete({ where: { id: req.params.id } });
    notifyAdmin(prisma, 'document.deleted', `Document ${doc.serialNo} was deleted by admin`, { serialNo: doc.serialNo }).catch(()=>{});
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
