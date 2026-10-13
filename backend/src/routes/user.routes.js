const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const redis = require('../config/redis');
const { auth, requireAdmin } = require('../middleware/auth');
const { logActivity } = require('../utils/security');
const { validatePassword } = require('../middleware/passwordPolicy');

// ---------- Employees (Users with role EMPLOYEE) ----------
router.get('/employees', auth, requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    select: {
      id: true, email: true, name: true, phone: true,
      active: true, lastLogin: true, createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

// ---------- All Users (kept for backwards compat) ----------
router.get('/', auth, requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, name: true, role: true,
      active: true, lastLogin: true, createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

// ---------- Create user (admin only) ----------
router.post('/', auth, requireAdmin, async (req, res) => {
  const { email, password, name, role, phone } = req.body;
  const errors = validatePassword(password);
  if (errors.length) return res.status(400).json({ error: 'Password policy', details: errors });
  const hashed = await bcrypt.hash(password, 10);
  const u = await prisma.user.create({
    data: { email, password: hashed, name, role: role || 'EMPLOYEE', phone },
  });
  await logActivity({
    userId: req.user.id,
    action: 'USER_CREATE',
    interface: 'web',
    details: `${email} as ${role}`,
    ip: req.ip,
  });
  res.json({ id: u.id, email: u.email, role: u.role, name: u.name });
});

// ---------- Delete user (admin only) ----------
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (u?.role === 'ADMIN') return res.status(400).json({ error: 'Cannot delete admin' });
  await prisma.user.delete({ where: { id: req.params.id } });
  await logActivity({
    userId: req.user.id,
    action: 'USER_DELETE',
    interface: 'web',
    details: u?.email,
    ip: req.ip,
  });
  res.json({ success: true });
});

// ---------- Force logout ----------
router.post('/:id/force-logout', auth, requireAdmin, async (req, res) => {
  const id = req.params.id;
  await redis.set(`blacklist:user:${id}`, '1', { EX: 8 * 60 * 60 });
  await logActivity({
    userId: req.user.id,
    action: 'FORCE_LOGOUT',
    interface: 'web',
    details: `user ${id}`,
    ip: req.ip,
  });
  req.app.get('io').to(`user-${id}`).emit('force-logout');
  res.json({ success: true });
});

// ---------- Toggle active ----------
router.put('/:id/toggle', auth, requireAdmin, async (req, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.params.id } });
  res.json(
    await prisma.user.update({
      where: { id: req.params.id },
      data: { active: !u.active },
    })
  );
});

// ---------- Customers (managed by admin) ----------
router.get('/customers/list', auth, requireAdmin, async (req, res) => {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(customers);
});

router.delete('/customers/:id', auth, requireAdmin, async (req, res) => {
  const c = await prisma.customer.findUnique({ where: { id: req.params.id } });
  await prisma.customer.delete({ where: { id: req.params.id } });
  await logActivity({
    userId: req.user.id,
    action: 'CUSTOMER_DELETE',
    interface: 'web',
    details: c?.email,
    ip: req.ip,
  });
  res.json({ success: true });
});

module.exports = router;