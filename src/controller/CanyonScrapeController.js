import Playwright from 'playwright';
import CanyonProduct from '../model/CanyonProduct.js';

export default class CanyonScrapeController {

    async scrape(url) {
        const productMap = new Map();
    
        const browser = await Playwright.chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);

        const productDescriptionName = await page.locator('.productDescription__productName').allInnerTexts();
        const productSizeCategories = await page.locator('.productConfiguration__selectVariant').allInnerTexts();
        const productImage = await page
            .locator('.productHeroCarousel__img[title="' + productDescriptionName[0] + '"][src*="www.canyon.com/dw/image/"]')
            .nth(0).getAttribute('src');

        const productPrice = await page.locator('.productDescription__priceSale').allInnerTexts();

        productSizeCategories.forEach((productSizeCategory) => {
            const splitInfo = productSizeCategory.split('\n');
            console.log(splitInfo);

            let availability;
            if (splitInfo[1] === 'Bald verfügbar') {
                availability = false;
            } else {
                availability = true;
            }

            console.log("availability: " + availability);

            productMap.set(splitInfo[0], availability);
        });

        await browser.close();
        return new CanyonProduct(productDescriptionName[0], productPrice, productMap, productImage, url);
    }
}