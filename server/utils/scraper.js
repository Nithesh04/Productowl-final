const puppeteer = require('puppeteer');

function extractPrice(priceString) {
  if (!priceString) return 0;

  // Remove all non-numeric except commas and dots
  let cleaned = priceString.replace(/[^\d.,]/g, '').trim();

  // Remove commas (for Indian currency like 1,37,790)
  cleaned = cleaned.replace(/,/g, '');

  let price = parseFloat(cleaned);

  // Only divide if:
  // - Price is less than 1000 (to avoid ₹137,790 → 1377)
  // - AND original string contains no commas (indicating it wasn’t in lakh format)
  // - AND priceString contains at least 3 digits and ends with '.00' (likely paise format)

  const looksLikePaise = /^\d+\.00$/.test(cleaned);
  const hasComma = priceString.includes(',');

  if (price > 0 && price < 1000 && looksLikePaise && !hasComma) {
    price = price / 100;
  }

  return Math.round(price);
}


class AmazonScraper {
  constructor() {
    this.browser = null;
  }

  async init() {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
    this.browser = await puppeteer.launch({
      headless: 'new',
      executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async scrapeProduct(url) {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();

    try {
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)...');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      try {
        await page.waitForSelector('#productTitle', { timeout: 5000 });
      } catch {
        try {
          await page.waitForSelector('h1[data-automation-id="product-title"]', { timeout: 5000 });
        } catch {
          await page.waitForSelector('h1', { timeout: 5000 }).catch(() => {});
        }
      }

      const productData = await page.evaluate(() => {
        let title = '';
        const titleSelectors = ['#productTitle', 'h1[data-automation-id="product-title"]', 'h1'];
        for (const selector of titleSelectors) {
          const el = document.querySelector(selector);
          if (el && el.textContent.trim()) {
            title = el.textContent.trim();
            break;
          }
        }

        let imageUrl = '';
        const imageSelectors = ['#landingImage', '#imgBlkFront', '#main-image', '.a-dynamic-image'];
        for (const selector of imageSelectors) {
          const el = document.querySelector(selector);
          if (el?.src) {
            imageUrl = el.src;
            break;
          }
        }

        const getPriceFromSelectors = (selectors) => {
          for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
              return el.textContent.trim();
            }
          }
          return null;
        };

        const priceText = getPriceFromSelectors([
          '.a-price-whole',
          '.a-offscreen',
          '.a-price .a-offscreen',
          '[data-a-color="price"] .a-offscreen'
        ]);

        const originalPriceText = getPriceFromSelectors([
          '.a-text-strike',
          '.a-price.a-text-price .a-offscreen',
          '.a-price.a-text-price span'
        ]);

        return {
          title,
          imageUrl,
          priceText,
          originalPriceText
        };
      });

      await page.close();

      const currentPrice = extractPrice(productData.priceText);
      let originalPrice = extractPrice(productData.originalPriceText);
      if (!originalPrice || originalPrice <= currentPrice) originalPrice = currentPrice;

      const highestPrice = Math.max(currentPrice, originalPrice);
      const lowestPrice = Math.min(currentPrice, originalPrice);
      const averagePrice = (currentPrice + originalPrice) / 2;

      return {
        title: productData.title,
        imageUrl: productData.imageUrl,
        currentPrice,
        originalPrice,
        highestPrice,
        lowestPrice,
        averagePrice: Math.round(averagePrice)
      };

    } catch (error) {
      await page.close();
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }

  async scrapePriceUpdate(url) {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();

    try {
      await page.setUserAgent('Mozilla/5.0...');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const priceText = await page.evaluate(() => {
        const selectors = ['.a-price-whole', '.a-offscreen'];
        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el) return el.textContent.trim();
        }
        return null;
      });

      await page.close();
      return extractPrice(priceText);

    } catch (error) {
      await page.close();
      throw new Error(`Price update scraping failed: ${error.message}`);
    }
  }
}

module.exports = new AmazonScraper();
