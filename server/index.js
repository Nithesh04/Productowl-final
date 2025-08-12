const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');


// Import routes
const productRoutes = require('./routes/products');
const trackingRoutes = require('./routes/tracking');
const authRoutes = require('./routes/auth');

// Import cron job
const { checkPricesAndNotify } = require('./utils/cronJob');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/productowl', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tracking', trackingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ProductOwl API is running' });
});

// Serve React app in production if build exists
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');
  const indexHtmlPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req, res) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    console.log('client/dist not found; serving API only');
  }
}

// Start CRON job to check prices daily at 7 AM
cron.schedule('0 7 * * *', () => {
  console.log('Running daily price check...');
  checkPricesAndNotify();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 