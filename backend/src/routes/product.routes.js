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

router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { children: true, parent: true } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
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

// THE OUT-OF-THE-BOX POST UPDATE ROUTE
router.post('/update/:id', auth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log("POST UPDATE RECEIVED FOR:", req.params.id);
    const { name, description, price, vat, category, stock, size, brand } = req.body;
    let updateData = { name: name || 'Unnamed', description: description || '', price: parseFloat(price) || 0, vat: vat === 'true', stock: parseInt(stock) || 0, category: category || 'Equipment', size: size || null, brand: brand || null };
    
    if (req.file) { updateData.imageUrl = await processImage(req.file); }
    
    const product = await prisma.product.update({ where: { id: req.params.id }, data: updateData });
    res.json(product);
  } catch (e) { 
    console.error("UPDATE ERROR:", e.message);
    res.status(500).json({ error: e.message }); 
  }
});

// Keep PUT as a fallback
router.put('/:id', auth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, category, stock, size, brand } = req.body;
    let updateData = { name: name || 'Unnamed', description: description || '', price: parseFloat(price) || 0, vat: vat === 'true', stock: parseInt(stock) || 0, category: category || 'Equipment', size: size || null, brand: brand || null };
    if (req.file) { updateData.imageUrl = await processImage(req.file); }
    const product = await prisma.product.update({ where: { id: req.params.id }, data: updateData });
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
