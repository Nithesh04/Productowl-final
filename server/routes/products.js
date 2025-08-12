const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Tracking = require('../models/Tracking');
const scraper = require('../utils/scraper');
const auth = require('../middleware/auth');

// Get all products (for non-authenticated users) or user's tracked products (for authenticated users)
router.get('/', async (req, res) => {
  try {
    // Check if user is authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const User = require('../models/User');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (user) {
          // Get user's tracked products
          const trackingEntries = await Tracking.find({ 
            userId: user._id,
            isActive: true 
          })
          
          .sort({ createdAt: -1 }) 
          .populate('productId');
          
          // Maintain the order from trackingEntries
          const trackedProducts = trackingEntries.map(entry => entry.productId);
          res.json(trackedProducts);
          return;
        }
      } catch (error) {
        // If token is invalid, continue to return all products
        console.log('Invalid token, returning all products');
      }
    }
    
    // Return all products for non-authenticated users or invalid tokens
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a specific product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Scrape and add new product
router.post('/scrape', async (req, res) => {
  try {
    const { amazonUrl } = req.body;

    if (!amazonUrl) {
      return res.status(400).json({ error: 'Amazon URL is required' });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ amazonUrl });
    if (existingProduct) {
      return res.json({
        message: 'Product already exists',
        product: existingProduct
      });
    }

    // Scrape product data
    console.log('Scraping product from:', amazonUrl);
    const scrapedData = await scraper.scrapeProduct(amazonUrl);

    // Create new product
    const product = new Product({
      amazonUrl,
      title: scrapedData.title,
      imageUrl: scrapedData.imageUrl,
      currentPrice: scrapedData.currentPrice,
      originalPrice: scrapedData.originalPrice,
      highestPrice: scrapedData.highestPrice,
      lowestPrice: scrapedData.lowestPrice,
      averagePrice: scrapedData.averagePrice,
      priceHistory: [{
        price: scrapedData.currentPrice,
        date: new Date()
      }]
    });

    await product.save();
    console.log('Product saved:', product.title);

    res.status(201).json({
      message: 'Product scraped and saved successfully',
      product
    });

  } catch (error) {
    console.error('Error scraping product:', error);
    res.status(500).json({ 
      error: 'Failed to scrape product',
      details: error.message 
    });
  }
});

// Update product price
router.put('/:id/price', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Scrape current price
    const currentPrice = await scraper.scrapePriceUpdate(product.amazonUrl);
    
    if (currentPrice === 0) {
      return res.status(400).json({ error: 'Failed to get current price' });
    }

    // Update product price
    await product.updatePrice(currentPrice);

    res.json({
      message: 'Product price updated successfully',
      product
    });

  } catch (error) {
    console.error('Error updating product price:', error);
    res.status(500).json({ error: 'Failed to update product price' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router; 