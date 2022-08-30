export default class ServiceFacade {

    constructor(discordController, userController, scheduleController, canyonScrapeController) {
        this.discordController = discordController;
        this.userController = userController;
        this.scheduleController = scheduleController;
        this.canyonScrapeController = canyonScrapeController;
    }

    start(interval) {
        this.scheduleController.scheduleJob(interval, () => this.processScrapeEntries);
    }

    async processScrapeEntries() {
        const users = await this.userController.getAllUsers();

        if (!users || Array.isArray(users) && users.length == 0) {
            return;
        }

        for (const user of users) {
            const urls = user.urls;
            for (const url of urls) {
                const canyonProduct = await this.canyonScrapeController.scrape(url.url);
                const sizes = url.sizes;
                const availabilityMap = canyonProduct.getAvailabilityMap();

                //check if any registered size is availabe
                let sendMessage = false;
                sizes.forEach(size => {
                    if(availabilityMap.get(size)) {
                        sendMessage = true;
                    }
                });

                //ewww this is ugly, send message if any size is available or not sent in the last 12 hours
                if (sendMessage || Date.now() - url.lastSent > 1000 * 60 * 60 * 12) {
                    await this.discordController.sendProduct(user.discordId, canyonProduct);
                    url.lastSent = Date.now();
                    user.save();
                }

                //prevent flodding page
                await this.sleep(10000);
            }
        }
    }

    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }
}