import Playwright from 'playwright';
import CanyonProduct from '../model/CanyonProduct.js';

export default class CanyonScrapeController {

    url;

    constructor(url) {
        this.url = url;
    }

    async scrape() {
        const productMap = new Map();
    
        const browser = await Playwright.chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
    
        await page.goto(this.url);
        const productDescriptionName = await page.locator('.productDescription__productName').allInnerTexts();
        const productSizeCategories = await page.locator('.productConfiguration__selectVariant').allInnerTexts();
        productSizeCategories.forEach((productSizeCategory) => {
            const splitInfo = productSizeCategory.split('\n');
            productMap.set(splitInfo[0], splitInfo[1]);
        });
        await browser.close();

        return new CanyonProduct(productDescriptionName[0], productMap, null);
    }
}