const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'infield_products', // The folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// 3. GET all products (Needed by your frontend dropdown)
router.get('/', async (req, res) => {
  try {
    // TODO: Replace this with your actual database query to get products
    // Example: const products = await db.query('SELECT * FROM products');
    
    // For now, returning a dummy list so your frontend doesn't crash
    res.json([
      { id: '1', name: 'Solar Panel 400W', price: 15000, image_url: 'https://placehold.co/150' },
      { id: '2', name: 'Inverter 3KVA', price: 45000, image_url: 'https://placehold.co/150' }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. POST a new product with an image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // req.file.path contains the permanent Cloudinary URL (e.g., https://res.cloudinary.com/...)
    const imageUrl = req.file ? req.file.path : null;
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // TODO: Save this to your PostgreSQL database!
    // Example (using pg): 
    // await db.query('INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4)', [name, price, description, imageUrl]);

    res.status(201).json({
      message: 'Product added successfully',
      product: {
        name,
        price,
        description,
        image_url: imageUrl // The permanent image link!
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

module.exports = router;
