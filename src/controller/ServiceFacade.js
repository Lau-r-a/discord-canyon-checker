import logger from '../util/logger.js';

const SLEEP_BETWEEN_SCRAPE_MS = 9600;

export default class ServiceFacade {

    constructor(discordController, userController, scheduleController, canyonScrapeController) {
        this.discordController = discordController;
        this.userController = userController;
        this.scheduleController = scheduleController;
        this.canyonScrapeController = canyonScrapeController;
    }

    start(interval, forceSendHours) {
        this.forceSendHours = forceSendHours;
        this.scheduleController.scheduleJob(interval, () => {this.processScrapeEntries();});
    }

    async processScrapeEntries() {
        logger.info("Processing scrape entries...");
        const users = await this.userController.getAllUsers();

        if (!users || Array.isArray(users) && users.length == 0) {
            logger.info('No users found');
            return;
        }
        
        logger.info("Processing scrape entries for " + users.length + " users");

        for (const user of users) {
            const urls = user.urls;
            logger.info("Processing scrape entries for user " + user.discordId);
            for (const url of urls) {

                logger.info(`Processing ${url.url}`);
  
                if (await this.isAvailable(url) || this.isForceSend(url.lastSent)) {
                    await this.discordController.sendProduct(user.discordId, canyonProduct);
                    //set last send date and save model
                    url.lastSent = Date.now();
                    user.save();
                }

                //prevent flodding page
                await this.sleep(SLEEP_BETWEEN_SCRAPE_MS);
            }
        }
    }

    async isAvailable(url) {
        const sizes = url.sizes;

        const canyonProduct = await this.canyonScrapeController.scrape(url.url);
        const availabilityMap = canyonProduct.getAvailabilityMap();

        //check if any registered size is availabe
        sizes.forEach(size => {
            if(availabilityMap.get(size)) {
                return true;
            }
        });

        return false;
    }

    isForceSend(lastSent) {
        return Date.now() - lastSent > 1000 * 60 * 60 * this.forceSendHours;
    }

    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }
}