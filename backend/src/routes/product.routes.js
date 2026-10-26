const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');

const upload = multer({ dest: 'uploads/tmp/' });

async function processImage(file) {
  if (!file) return null;
  const filename = 'product-' + Date.now() + '.jpg';
  const out = path.join(__dirname, '../../uploads/products', filename);
  await sharp(file.path).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 85 }).toFile(out);
  fs.unlinkSync(file.path);
  return '/uploads/products/' + filename;
}

router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// UNIFIED POST ROUTE: Handles both Adding and Editing flawlessly
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { id, name, description, price, vat, category, type, brand, size, stock } = req.body;
    const imageUrl = await processImage(req.file);

    let data = { 
      name: name || 'Unnamed', 
      description: description || '', 
      price: parseFloat(price) || 0, 
      vat: vat === 'true', 
      category: category || 'General', 
      type: type || null,
      brand: brand || 'Generic',
      size: size || null,
      stock: parseInt(stock) || 0
    };
    
    if (imageUrl) data.imageUrl = imageUrl;

    if (id) {
      // EDIT MODE: Check if product exists first to prevent crash
      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: 'Product not found. The database may have been updated. Please refresh the page.' });
      }
      const product = await prisma.product.update({ where: { id }, data });
      res.json(product);
    } else {
      // ADD MODE
      const product = await prisma.product.create({
        data: { ...data, status: 'APPROVED', createdBy: req.user.id }
      });
      res.json(product);
    }
  } catch (e) { 
    console.error("POST ERROR:", e);
    res.status(500).json({ error: e.message }); 
  }
});

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
