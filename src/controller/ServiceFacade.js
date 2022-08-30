export default class Facade {

    constructor(discordController, userController, scheduleController, canyonScrapeController) {
        this.discordController = discordController;
        this.userController = userController;
        this.scheduleController = scheduleController;
        this.canyonScrapeController = canyonScrapeController;
    }

    start(interval) {
        this.scheduleController.scheduleJob(interval, async () => {
            const users = await this.userController.getAllUsers();
            if (!users || Array.isArray(users) && users.length == 0) {
                return;
            }
            for (const user of users) {
                const urls = user.urls;
                for (const url of urls) {
                    const canyonProduct = await this.canyonScrapeController.scrape(url.url);
                    await this.discordController.sendProduct(user.discordId, canyonProduct);
                    await this.sleep(10000);
                }
            }
        });
    }

    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }
}