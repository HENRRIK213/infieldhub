const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const { logActivity } = require('../utils/security');

router.get('/', auth, requireAdmin, async (req, res) => {
  const { userId, action, interface: iface, severity, from, to, page = 1, limit = 50 } = req.query;
  const where = {};
  if (userId) where.userId = userId;
  if (action) where.action = { contains: action };
  if (iface) where.interface = iface;
  if (severity) where.severity = severity;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }
  const [logs, total] = await Promise.all([
    prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: Number(limit),
      include: { user: { select: { email: true, role: true } } },
    }),
    prisma.log.count({ where }),
  ]);
  res.json({ logs, total, page: Number(page), pages: Math.ceil(total / limit) });
});

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  await prisma.log.delete({ where: { id: req.params.id } });
  await logActivity({
    userId: req.user.id,
    action: 'LOG_DELETE',
    interface: 'web',
    details: req.params.id,
    ip: req.ip,
  });
  res.json({ success: true });
});

router.get('/alerts', auth, requireAdmin, async (req, res) => {
  res.json(
    await prisma.securityAlert.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  );
});

router.put('/alerts/:id/resolve', auth, requireAdmin, async (req, res) => {
  res.json(
    await prisma.securityAlert.update({
      where: { id: req.params.id },
      data: { resolved: true },
    })
  );
});

module.exports = router;