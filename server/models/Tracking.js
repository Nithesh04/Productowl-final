const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastNotified: {
    type: Date,
    default: null
  }
});

// Compound index to ensure unique user-product combinations
trackingSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Tracking', trackingSchema); 