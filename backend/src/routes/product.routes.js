const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { PrismaClient, Prisma } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { auth, requireAdmin } = require('../middleware/auth');

class ProductInputError extends Error {}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype)) {
      return callback(new Error('Upload a JPEG, PNG, WebP, or AVIF image'));
    }
    callback(null, true);
  },
});

const imageUpload = (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Product images must be 5 MB or smaller' });
    }
    return res.status(400).json({ error: error.message || 'Invalid image upload' });
  });
};

async function processImage(file) {
  if (!file) return undefined;
  try {
    const image = await sharp(file.buffer)
      .rotate()
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
    return `data:image/jpeg;base64,${image.toString('base64')}`;
  } catch (error) {
    if (error.message && error.message.includes('Input buffer contains unsupported image format')) {
      throw new ProductInputError('The uploaded file is not a supported image');
    }
    throw error;
  }
}

function readProductFields(body, imageUrl) {
  const price = Number(body.price);
  const stock = Number.parseInt(body.stock, 10);
  if (!body.name || !body.name.trim()) throw new ProductInputError('Product name is required');
  if (!Number.isFinite(price) || price < 0) throw new ProductInputError('Price must be a non-negative number');
  if (!Number.isInteger(stock) || stock < 0) throw new ProductInputError('Stock must be a non-negative integer');

  return {
    name: body.name.trim(),
    description: body.description || '',
    price,
    vat: body.vat === 'true',
    category: body.category || 'General',
    type: body.type || null,
    brand: body.brand || 'Generic',
    size: body.size || null,
    stock,
    status: body.status || 'APPROVED',
    ...(imageUrl !== undefined ? { imageUrl } : {}),
  };
}

router.get('/', auth, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: req.user.role === 'ADMIN' ? undefined : { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Product list failed:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (req.user.role !== 'ADMIN' && product.status !== 'APPROVED') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Product lookup failed:', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

router.post('/', auth, requireAdmin, imageUpload, async (req, res) => {
  try {
    const imageUrl = await processImage(req.file);
    const data = readProductFields(req.body, imageUrl);
    const product = await prisma.product.create({
      data: { ...data, createdBy: req.user.id },
    });
    res.status(201).json(product);
  } catch (error) {
    const status = error instanceof ProductInputError ? 400 : 500;
    console.error('Product create failed:', error);
    res.status(status).json({ error: error.message || 'Failed to create product' });
  }
});

router.put('/:id', auth, requireAdmin, imageUpload, async (req, res) => {
  try {
    const imageUrl = await processImage(req.file);
    const data = readProductFields(req.body, imageUrl);
    const product = await prisma.product.update({ where: { id: req.params.id }, data });
    res.json(product);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Product no longer exists. Please refresh.' });
    }
    const status = error instanceof ProductInputError ? 400 : 500;
    console.error('Product update failed:', error);
    res.status(status).json({ error: error.message || 'Failed to update product' });
  }
});

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Product no longer exists. Please refresh.' });
    }
    console.error('Product delete failed:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
