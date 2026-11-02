const express = require('express');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { auth, requireAdmin } = require('../middleware/auth');
const { generateDocumentPDF } = require('../utils/pdf');

const router = express.Router();
const prisma = new PrismaClient();
const documentTypes = new Set(['QUOTATION', 'INVOICE', 'REPORT', 'POSTER']);

router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const allDocs = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
    const quotes = allDocs.filter((document) => document.type === 'QUOTATION');
    const invoices = allDocs.filter((document) => document.type === 'INVOICE');
    res.json({
      totalQuotes: quotes.length,
      totalInvoices: invoices.length,
      approvedQuotes: quotes.filter((document) => document.status === 'APPROVED').length,
      pendingQuotes: quotes.filter((document) => ['DRAFT', 'SENT'].includes(document.status)).length,
      recentDocs: allDocs.slice(0, 5),
    });
  } catch (error) {
    console.error('Document statistics failed:', error.code || error.name);
    res.status(503).json({ error: 'Could not load document statistics' });
  }
});

router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const documents = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(documents);
  } catch (error) {
    console.error('Document list failed:', error.code || error.name);
    res.status(503).json({ error: 'Could not load document history' });
  }
});

router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { type, title, clientName, clientPhone, content, total = 0 } = req.body;
    if (!documentTypes.has(type)) {
      return res.status(400).json({ error: 'Choose a valid document type' });
    }
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Document title is required' });
    }
    const numericTotal = Number(total);
    if (!Number.isFinite(numericTotal) || numericTotal < 0) {
      return res.status(400).json({ error: 'Document total must be a non-negative number' });
    }
    const serializedContent = JSON.stringify(content ?? {});
    if (Buffer.byteLength(serializedContent, 'utf8') > 1024 * 1024) {
      return res.status(413).json({ error: 'Document content must be smaller than 1 MB' });
    }

    const prefix = { QUOTATION: 'QT', INVOICE: 'INV', REPORT: 'RPT', POSTER: 'PSTR' }[type];
    const document = await prisma.document.create({
      data: {
        type,
        title: title.trim(),
        clientName: typeof clientName === 'string' ? clientName.trim() : null,
        clientPhone: typeof clientPhone === 'string' ? clientPhone.trim() : null,
        content: serializedContent,
        total: numericTotal,
        serialNo: `${prefix}-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        status: 'GENERATED',
      },
    });
    res.status(201).json(document);
  } catch (error) {
    console.error('Document save failed:', error.code || error.name);
    res.status(503).json({ error: 'Could not save this document to history' });
  }
});

router.get('/:id/pdf', auth, requireAdmin, async (req, res) => {
  try {
    const document = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    let content;
    try {
      content = JSON.parse(document.content || '{}');
    } catch (error) {
      console.error('Stored document content is invalid:', document.id);
      return res.status(422).json({ error: 'This document cannot be regenerated because its saved content is invalid' });
    }

    const ids = Array.isArray(content.featuredProductIds)
      ? [...new Set(content.featuredProductIds.filter((id) => typeof id === 'string'))].slice(0, 3)
      : [];
    const featuredProducts = ids.length
      ? await prisma.product.findMany({ where: { id: { in: ids } } })
      : [];
    const pdfPath = await generateDocumentPDF(document, featuredProducts);
    const filename = `${document.serialNo.replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`;
    res.download(pdfPath, filename, (error) => {
      if (error && !res.headersSent) {
        console.error('Document PDF download failed:', error.code || error.name);
        res.status(500).json({ error: 'Could not download this document' });
      }
    });
  } catch (error) {
    console.error('Document PDF generation failed:', error.code || error.name);
    res.status(500).json({ error: 'Could not generate this document PDF' });
  }
});

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Document not found' });
    console.error('Document delete failed:', error.code || error.name);
    res.status(503).json({ error: 'Could not delete this document' });
  }
});

module.exports = router;
