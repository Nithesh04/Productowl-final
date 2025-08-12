# ProductOwl 🦉

A full-stack web application for tracking Amazon product prices and getting notified when prices drop. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **Smart Price Tracking**: Scrape Amazon product data including images, titles, and prices
- **Price History**: Maintain comprehensive price history with highest, lowest, and average prices
- **Email Notifications**: Get notified when prices drop by 40% or more
- **Modern UI**: Clean, dark-themed interface with responsive design
- **Real-time Updates**: Daily CRON jobs check for price changes
- **No Authentication Required**: Simple and user-friendly experience

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Styled Components** for modern styling
- **React Router** for navigation
- **React Icons** for beautiful icons
- **Framer Motion** for smooth animations

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Puppeteer** for web scraping
- **Nodemailer** for email notifications
- **Node-Cron** for scheduled tasks

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account for email notifications

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProductOwl
   ```

2. **Install dependencies for both client and server**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env # if needed
   ```
   
   Edit the `.env` files with your configuration as needed.

4. **Start the applications (in two terminals):**
   - **Terminal 1:**
     ```bash
     cd server
     npm run dev
     ```
   - **Terminal 2:**
     ```bash
     cd client
     npm run dev
     ```

   The backend server will run on port 5000 and the frontend on port 3000 by default.

## 📧 Email Setup

To enable email notifications, you need to:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update your `.env` file** with the app password

## 🎯 Usage

### Adding Products
1. Navigate to the homepage
2. Paste an Amazon product URL in the search bar
3. Click "Track Product" to scrape and store the product

### Tracking Prices
1. Click on any product card to view details
2. Click "Track Price" button
3. Enter your email address
4. You'll receive notifications when prices drop by 40% or more

### Viewing Product Details
- **Product Image**: High-quality product image
- **Product Title**: Full product name
- **Current Price**: Latest price with discount indicators
- **Price Analysis**: Four cards showing current, average, highest, and lowest prices
- **Visit Product**: Direct link to Amazon product page

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products/scrape` - Scrape and add new product
- `PUT /api/products/:id/price` - Update product price
- `DELETE /api/products/:id` - Delete product

### Tracking
- `POST /api/tracking/subscribe` - Subscribe to price alerts
- `GET /api/tracking/user/:email` - Get user's tracking subscriptions
- `PUT /api/tracking/unsubscribe/:id` - Unsubscribe from tracking
- `DELETE /api/tracking/:id` - Delete tracking subscription

## 📊 Database Schema

### Product Model
```javascript
{
  amazonUrl: String,
  title: String,
  imageUrl: String,
  currentPrice: Number,
  originalPrice: Number,
  highestPrice: Number,
  lowestPrice: Number,
  averagePrice: Number,
  priceHistory: [{
    price: Number,
    date: Date
  }],
  createdAt: Date,
  lastUpdated: Date
}
```

### Tracking Model
```javascript
{
  email: String,
  productId: ObjectId,
  originalPrice: Number,
  isActive: Boolean,
  createdAt: Date,
  lastNotified: Date
}
```

## 🔄 CRON Jobs

The application runs daily price checks at 9 AM (IST):
- Scrapes current prices for all tracked products
- Updates price history and statistics
- Sends email notifications for significant price drops (≥40%)

## 🎨 UI Features

- **Dark Theme**: Modern dark interface with blue accents
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Spinners and progress indicators
- **Error Handling**: User-friendly error messages
- **Modal Dialogs**: Clean tracking subscription flow

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. For Render server-only deploy: set root to `server/`, Build: `npm ci --omit=dev`, Start: `node index.js`, `NODE_ENV=production`. Do not skip Chromium download if using Puppeteer.

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to Netlify, Vercel, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is running
4. Check your email configuration

## 🔮 Future Enhancements

- [ ] Price history charts and graphs
- [ ] Multiple email providers support
- [ ] Push notifications
- [ ] Product categories and filters
- [ ] Price prediction algorithms
- [ ] Social sharing features
- [ ] Mobile app development

---

Built with ❤️ by the ProductOwl Team 