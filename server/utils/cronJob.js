const Tracking = require('../models/Tracking');
const Product = require('../models/Product');
const scraper = require('./scraper');
const emailService = require('./emailService');

async function checkPricesAndNotify() {
  console.log('Starting daily price check and notification process...');
  
  try {
    // Get all active tracking entries
    const trackingEntries = await Tracking.find({ isActive: true })
      .populate('productId')
      .exec();

    console.log(`Found ${trackingEntries.length} active tracking entries`);

    for (const tracking of trackingEntries) {
      try {
        const product = tracking.productId;
        if (!product) {
          console.log(`Product not found for tracking ID: ${tracking._id}`);
          continue;
        }

        // Scrape current price
        const currentPrice = await scraper.scrapePriceUpdate(product.amazonUrl);
        
        if (currentPrice === 0) {
          console.log(`Failed to get current price for product: ${product.title}`);
          continue;
        }

        // Update product price
        await product.updatePrice(currentPrice);

        // Check if price drop is significant (30% or more)
        const priceDropPercentage = ((tracking.originalPrice - currentPrice) / tracking.originalPrice) * 100;
        
        if (priceDropPercentage >= 30) {
          console.log(`Significant price drop detected for ${product.title}: ${priceDropPercentage.toFixed(1)}%`);
          
          // Send notification email
          const emailSent = await emailService.sendPriceDropNotification(
            tracking.email,
            product,
            currentPrice,
            tracking.originalPrice
          );

          if (emailSent) {
            // Update tracking entry
            tracking.lastNotified = new Date();
            await tracking.save();
            console.log(`Notification sent to ${tracking.email} for ${product.title}`);
          }
        } else {
          console.log(`Price drop for ${product.title} is ${priceDropPercentage.toFixed(1)}% (below 40% threshold)`);
        }

        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Error processing tracking entry ${tracking._id}:`, error);
      }
    }

    console.log('Daily price check and notification process completed');

  } catch (error) {
    console.error('Error in daily price check:', error);
  }
}

module.exports = {
  checkPricesAndNotify
}; 