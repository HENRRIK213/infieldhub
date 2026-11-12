const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true, name: true, category: true, type: true,
        size: true, brand: true, price: true, imageUrl: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET SINGLE PRODUCT (FIXED)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching product with ID: ${id}`);

    const product = await prisma.product.findUnique({
      where: { id: id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found in database' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching single product:', error);
    res.status(500).json({ error: 'Server error while fetching product' });
  }
});

module.exports = router;
