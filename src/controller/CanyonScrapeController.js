import Playwright from 'playwright';
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
        const productSizeCategories = await page.locator('.productConfiguration__selectVariant').allInnerTexts();
        productSizeCategories.forEach(async (productSizeCategory) => {
            const splitInfo = productSizeCategory.split('\n');
            productMap.set(splitInfo[0], splitInfo[1]);
        });
        await browser.close();
        return productMap;
    }
}