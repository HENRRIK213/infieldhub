const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const { logActivity } = require('../utils/security');
const { notifyAdmin } = require('../utils/notify');

const upload = multer({ dest: 'uploads/tmp/' });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, longDescription, price, vat, category, subCategory, stock } = req.body;
    let imageUrl = null;
    if (req.file) {
      const filename = 'product-' + Date.now() + '.jpg';
      const out = path.join(__dirname, '../../uploads/products', filename);
      await sharp(req.file.path).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 85 }).toFile(out);
      fs.unlinkSync(req.file.path);
      imageUrl = '/uploads/products/' + filename;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        longDescription,
        price: parseFloat(price),
        vat: vat === 'true' || vat === true,
        category,
        subCategory,
        stock: parseInt(stock) || 0,
        status: req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
        imageUrl,
        createdBy: req.user.id,
      },
    });

    // Socket notify (in-app)
    try {
      req.app.get('io').to('admin-room').emit('product:new', product);
    } catch (e) {}

    // Activity log
    try {
      await logActivity({
        userId: req.user.id,
        action: 'PRODUCT_ADD',
        interface: 'web',
        details: 'Added: ' + name,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    } catch (e) {}

    // Email + SMS notification to admin
    const actorEmail = req.user.email || 'unknown';
    const actorRole = req.user.role || 'STAFF';
    const statusLabel = product.status === 'APPROVED' ? 'approved' : 'pending review';
    notifyAdmin(
      prisma,
      'product.created',
      'New product by ' + actorEmail + ': ' + name + ' (KES ' + Number(product.price).toLocaleString() + ') - ' + statusLabel,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        category: product.category || 'N/A',
        stock: product.stock,
        status: product.status,
        addedBy: actorEmail,
        role: actorRole,
      }
    ).catch(function () {});

    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const { category, search, sort } = req.query;
  const where = { status: 'APPROVED' };
  if (category) where.category = category;
  if (search) where.name = { contains: search, mode: 'insensitive' };
  const orderBy = sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };
  const items = await prisma.product.findMany({ where, orderBy });
  res.json(items);
});

router.get('/admin/pending', auth, requireAdmin, async (req, res) => {
  res.json(
    await prisma.product.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } })
  );
});

router.get('/:id', async (req, res) => {
  const p = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

router.put('/:id/approve', auth, requireAdmin, async (req, res) => {
  const p = await prisma.product.update({
    where: { id: req.params.id },
    data: { status: 'APPROVED' },
  });
  try { req.app.get('io').to('admin-room').emit('product:approved', p); } catch (e) {}
  try {
    await logActivity({
      userId: req.user.id,
      action: 'PRODUCT_APPROVE',
      interface: 'web',
      details: 'Approved: ' + p.name,
      ip: req.ip,
    });
  } catch (e) {}
  res.json(p);
});

router.put('/:id/reject', auth, requireAdmin, async (req, res) => {
  const p = await prisma.product.update({
    where: { id: req.params.id },
    data: { status: 'REJECTED' },
  });
  try {
    await logActivity({
      userId: req.user.id,
      action: 'PRODUCT_REJECT',
      interface: 'web',
      details: 'Rejected: ' + p.name,
      ip: req.ip,
    });
  } catch (e) {}
  res.json(p);
});

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  const p = await prisma.product.findUnique({ where: { id: req.params.id } });
  await prisma.product.delete({ where: { id: req.params.id } });
  try {
    await logActivity({
      userId: req.user.id,
      action: 'PRODUCT_DELETE',
      interface: 'web',
      details: 'Deleted: ' + (p && p.name ? p.name : 'unknown'),
      ip: req.ip,
    });
  } catch (e) {}
  res.json({ success: true });
});

router.put('/:id/stock', auth, async (req, res) => {
  res.json(
    await prisma.product.update({
      where: { id: req.params.id },
      data: { stock: parseInt(req.body.stock) },
    })
  );
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/tmp/' });

// UPDATE PRODUCT (Edit Name, Price, VAT, Image)
router.put('/:id', auth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, stock, category } = req.body;
    let updateData = {
      name,
      description,
      price: parseFloat(price),
      vat: vat === 'true' || vat === true,
      stock: parseInt(stock) || 0,
      category
    };

    if (req.file) {
      const filename = 'product-' + Date.now() + '.jpg';
      const out = path.join(__dirname, '../../uploads/products', filename);
      await sharp(req.file.path).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 85 }).toFile(out);
      fs.unlinkSync(req.file.path);
      updateData.imageUrl = '/uploads/products/' + filename;
    }

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
