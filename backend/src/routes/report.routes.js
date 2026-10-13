const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');

router.get('/summary', auth, requireAdmin, async (req, res) => {
  const [users, products, quotations, payments, logs, alerts] = await Promise.all([
    prisma.user.count(),
    prisma.product.count({ where: { status: 'APPROVED' } }),
    prisma.quotation.count(),
    prisma.payment.count({ where: { status: 'APPROVED' } }),
    prisma.log.count(),
    prisma.securityAlert.count({ where: { resolved: false } }),
  ]);
  res.json({ users, products, quotations, payments, logs, alerts });
});

router.get('/activity', auth, requireAdmin, async (req, res) => {
  const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const logs = await prisma.log.findMany({
    where: { createdAt: { gte: start } },
    orderBy: { createdAt: 'asc' },
  });
  const grouped = {};
  logs.forEach((l) => {
    const day = l.createdAt.toISOString().slice(0, 10);
    grouped[day] = (grouped[day] || 0) + 1;
  });
  res.json(grouped);
});

module.exports = router;