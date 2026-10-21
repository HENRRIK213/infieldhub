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

const upload = multer({ dest: 'uploads/tmp/' });

// Helper to process images
async function processImage(file) {
  if (!file) return null;
  const filename = 'product-' + Date.now() + '.jpg';
  const out = path.join(__dirname, '../../uploads/products', filename);
  await sharp(file.path).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 85 }).toFile(out);
  fs.unlinkSync(file.path);
  return '/uploads/products/' + filename;
}

// GET ALL MAIN PRODUCTS (with their sub-products)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = { parentId: null }; // Only get main products
    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const products = await prisma.product.findMany({
      where,
      include: { children: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET SINGLE PRODUCT (with sub-products)
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { children: true, parent: true }
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE PRODUCT (Main or Sub)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, category, subCategory, stock, parentId } = req.body;
    const imageUrl = await processImage(req.file);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        vat: vat === 'true' || vat === true,
        category,
        subCategory,
        stock: parseInt(stock) || 0,
        status: req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
        imageUrl,
        createdBy: req.user.id,
        parentId: parentId || null
      },
    });

    try {
      req.app.get('io').to('admin-room').emit('product:new', product);
      await logActivity({ userId: req.user.id, action: 'PRODUCT_ADD', interface: 'web', details: 'Added: ' + name, ip: req.ip });
    } catch (e) {}

    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// UPDATE PRODUCT (Edit)
router.put('/:id', auth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, category, subCategory, stock } = req.body;
    
    let updateData = {
      name,
      description,
      price: parseFloat(price),
      vat: vat === 'true' || vat === true,
      stock: parseInt(stock) || 0,
      category,
      subCategory
    };

    if (req.file) {
      updateData.imageUrl = await processImage(req.file);
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData
    });

    try {
      await logActivity({ userId: req.user.id, action: 'PRODUCT_EDIT', interface: 'web', details: 'Edited: ' + name, ip: req.ip });
    } catch (e) {}

    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE PRODUCT (Cascades to children)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    await prisma.product.delete({ where: { id: req.params.id } });
    
    try {
      await logActivity({ userId: req.user.id, action: 'PRODUCT_DELETE', interface: 'web', details: 'Deleted: ' + (product?.name || 'Unknown'), ip: req.ip });
    } catch (e) {}
    
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
