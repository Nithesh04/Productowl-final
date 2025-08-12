const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');
const Product = require('../models/Product');
const emailService = require('../utils/emailService');
const authenticateToken = require('../middleware/auth');
const mongoose = require('mongoose');

// Route to subscribe to a product
// Subscribe to product tracking
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid product ID format' 
      });
    }

    // Check if already tracking
    const existingTracking = await Tracking.findOne({ userId, productId });
    if (existingTracking) {
      return res.status(409).json({
        success: false,
        error: 'Already tracking this product'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Create new tracking
    const tracking = new Tracking({
      userId,
      email: req.user.email,
      productId,
      originalPrice: product.currentPrice,
      isActive: true
    });

    await tracking.save();

    // Send welcome email
    try {
      console.log(`Attempting to send welcome email to ${req.user.email}`);
      await emailService.sendWelcomeEmail(req.user.email, product);
      console.log('Welcome email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // You might want to store this failure in your database
      await Tracking.updateOne(
        { _id: tracking._id },
        { emailSent: false, emailError: emailError.message }
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Subscribed to product tracking',
      tracking
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
// Route to get all tracked products by a user

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const trackedProducts = await Tracking.find({ userId: req.user.id }).populate('productId');
    res.json(trackedProducts);
  } catch (error) {
    console.error('Error fetching tracked products:', error);
    res.status(500).json({ error: 'Failed to fetch tracked products' });
  }
});



// Route to delete a product and all associated tracking entries
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Tracking.deleteMany({ productId: req.params.id });

    res.json({ message: 'Product and associated tracking entries deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
