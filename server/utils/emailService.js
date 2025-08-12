const sgMail = require('@sendgrid/mail');
require('dotenv').config();
class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
  }

  

  async sendPriceDropNotification(email, product, newPrice, originalPrice) {
    const priceDropPercentage = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
    
    const msg = {
      to: email,
      from: 'gnithesh16@gmail.com',
      subject: `🎉 Price Drop Alert! ${product.title} is now ₹${newPrice}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #28a745; margin: 0;"> ProductOwl</h1>
              <h2 style="color: #333; margin: 10px 0;">Price Drop Alert!</h2>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #155724; margin: 0 0 15px 0;">Great News! 🎉</h3>
              <p style="color: #155724; margin: 0; font-size: 16px;">
                The price of <strong>${product.title}</strong> has dropped by <strong>${priceDropPercentage}%</strong>!
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold; color: #666;">Original Price:</span>
                <span style="text-decoration: line-through; color: #dc3545;">₹${originalPrice}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold; color: #666;">New Price:</span>
                <span style="font-weight: bold; color: #28a745; font-size: 18px;">₹${newPrice}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: bold; color: #666;">You Save:</span>
                <span style="font-weight: bold; color: #28a745;">₹${originalPrice - newPrice}</span>
              </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="${product.amazonUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Product on Amazon
              </a>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p>This alert was sent by ProductOwl - Your smart price tracking companion!</p>
              <p>You can unsubscribe from these alerts by visiting our website.</p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Price drop notification sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error.response?.body || error.message);
      return false;
    }
  }

  async sendWelcomeEmail(email, product) {
    const msg = {
      to: email,
      from: 'gnithesh16@gmail.com',
      subject: `👀 Welcome to ProductOwl! You're now tracking ${product.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #007bff; margin: 0;">👀 ProductOwl</h1>
              <h2 style="color: #333; margin: 10px 0;">Welcome to ProductOwl!</h2>
            </div>
            
            <div style="background-color: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #004085; margin: 0 0 15px 0;">You're all set! 🎉</h3>
              <p style="color: #004085; margin: 0; font-size: 16px;">
                You're now tracking <strong>${product.title}</strong> for price drops.
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h4 style="color: #333; margin: 0 0 15px 0;">What happens next?</h4>
              <ul style="color: #666; line-height: 1.6;">
                <li>We'll check the price daily at 7 AM</li>
                <li>If the price drops by 30% or more, you'll get an email alert</li>
                <li>You can track multiple products at once</li>
                <li>Never miss a great deal again!</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="${product.amazonUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Product on Amazon
              </a>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p>Thank you for using ProductOwl - Your smart price tracking companion!</p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error.response?.body || error.message);
      return false;
    }
  }
}

module.exports = new EmailService();