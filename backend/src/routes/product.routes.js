const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');
const { logActivity } = require('../utils/security'); // Import logger

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

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, category, type, brand, size, stock } = req.body;
    const imageUrl = await processImage(req.file);
    const product = await prisma.product.create({
      data: { 
        name: name || 'Unnamed', description: description || '', price: parseFloat(price) || 0, 
        vat: vat === 'true', category: category || null, type: type || null, brand: brand || null, 
        size: size || null, stock: parseInt(stock) || 0, status: req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING', 
        imageUrl, createdBy: req.user.id 
      },
    });
    
    // Notify Admin if employee added it
    if (req.user.role !== 'ADMIN') {
      await logActivity({ userId: req.user.id, action: 'PRODUCT_ADD', interface: 'web', details: `Employee added: ${name}` });
    }

    res.json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, vat, category, type, brand, size, stock } = req.body;
    let updateData = { 
      name: name || 'Unnamed', description: description || '', price: parseFloat(price) || 0, 
      vat: vat === 'true', category: category || null, type: type || null, brand: brand || null, 
      size: size || null, stock: parseInt(stock) || 0 
    };
    if (req.file) updateData.imageUrl = await processImage(req.file);
    
    // Find product first to ensure it exists
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found. It may have been deleted or refreshed.' });
    }

    // If Employee is editing, set to PENDING so Admin can approve
    if (req.user.role !== 'ADMIN') {
      updateData.status = 'PENDING';
    }

    const product = await prisma.product.update({ where: { id: req.params.id }, data: updateData });
    
    // Log the edit for the Admin
    await logActivity({ 
      userId: req.user.id, 
      action: 'PRODUCT_EDIT', 
      interface: 'web', 
      details: `${req.user.role} edited product: ${product.name} (ID: ${product.id})` 
    });

    res.json(product);
  } catch (e) { 
    console.error("Update error:", e);
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