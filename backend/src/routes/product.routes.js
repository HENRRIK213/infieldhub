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

// THE MAGIC UNIFIED ROUTE
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { id, name, description, price, vat, category, stock, parentId, size, brand } = req.body;
    const imageUrl = await processImage(req.file);

    let data = { 
      name: name || 'Unnamed', 
      description: description || '', 
      price: parseFloat(price) || 0, 
      vat: vat === 'true', 
      category: category || 'Equipment', 
      stock: parseInt(stock) || 0, 
      size: size || null, 
      brand: brand || null,
      parentId: parentId || null
    };
    
    if (imageUrl) data.imageUrl = imageUrl;

    if (id) {
      // UPDATE EXISTING (Editing)
      const product = await prisma.product.update({ where: { id }, data });
      res.json(product);
    } else {
      // CREATE NEW (Adding)
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
