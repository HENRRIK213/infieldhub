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

async function processImage(file) {
  if (!file) return null;
  const filename = 'product-' + Date.now() + '.jpg';
  const out = path.join(__dirname, '../../uploads/products', filename);
  await sharp(file.path).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 85 }).toFile(out);
  fs.unlinkSync(file.path);
  return '/uploads/products/' + filename;
}

// CREATE
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, category, subCategory, stock, parentId } = req.body;
    const imageUrl = await processImage(req.file);

    const product = await prisma.product.create({
      data: {
        name: name || 'Unnamed',
        description: description || '',
        price: parseFloat(price) || 0,
        vat: vat === 'true' || vat === true,
        category: category || 'General',
        subCategory: subCategory || null,
        stock: parseInt(stock) || 0,
        status: req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
        imageUrl,
        createdBy: req.user.id,
        parentId: parentId || null
      },
    });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE (Bulletproof Edit)
router.put('/:id', auth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, category, subCategory, stock } = req.body;
    
    let updateData = {
      name: name || 'Unnamed',
      description: description || '',
      price: parseFloat(price) || 0,
      vat: vat === 'true' || vat === true,
      stock: parseInt(stock) || 0,
      category: category || 'General',
      subCategory: subCategory || null
    };

    if (req.file) {
      updateData.imageUrl = await processImage(req.file);
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json(product);
  } catch (e) {
    console.error('UPDATE ERROR:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET ALL
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET ONE
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { children: true, parent: true }
    });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
