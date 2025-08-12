const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  amazonUrl: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  highestPrice: {
    type: Number,
    required: true
  },
  lowestPrice: {
    type: Number,
    required: true
  },
  averagePrice: {
    type: Number,
    required: true
  },
  priceHistory: [priceHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Calculate average price from price history
productSchema.methods.calculateAveragePrice = function() {
  if (this.priceHistory.length === 0) return this.currentPrice;
  
  const total = this.priceHistory.reduce((sum, entry) => sum + entry.price, 0);
  return Math.round(total / this.priceHistory.length);
};

// Update price and maintain history
productSchema.methods.updatePrice = function(newPrice) {
  this.currentPrice = newPrice;
  this.lastUpdated = new Date();
  
  // Add to price history
  this.priceHistory.push({
    price: newPrice,
    date: new Date()
  });
  
  // Update highest and lowest prices
  if (newPrice > this.highestPrice) {
    this.highestPrice = newPrice;
  }
  if (newPrice < this.lowestPrice) {
    this.lowestPrice = newPrice;
  }
  
  // Recalculate average price
  this.averagePrice = this.calculateAveragePrice();
  
  return this.save();
};

module.exports = mongoose.model('Product', productSchema); 