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
    const products = await prisma.product.findMany({ where: { parentId: null }, include: { children: true }, orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, category, stock, parentId, size, brand } = req.body;
    const imageUrl = await processImage(req.file);
    const product = await prisma.product.create({
      data: { name: name || 'Unnamed', description: description || '', price: parseFloat(price) || 0, vat: vat === 'true', category: category || 'Equipment', stock: parseInt(stock) || 0, status: 'APPROVED', imageUrl, createdBy: req.user.id, parentId: parentId || null, size: size || null, brand: brand || null },
    });
    res.json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// EXPLICIT UPDATE ROUTE (POST to bypass cache/routing issues)
router.post('/update', auth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id, name, description, price, vat, stock, size, brand } = req.body;
    if (!id) return res.status(400).json({ error: "Product ID required" });

    let updateData = { name, description, price: parseFloat(price), vat: vat === 'true', stock: parseInt(stock), size, brand };
    if (req.file) { updateData.imageUrl = await processImage(req.file); }
    
    const product = await prisma.product.update({ where: { id }, data: updateData });
    res.json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
