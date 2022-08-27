import CanyonScrapeController from './controller/CanyonScrapeController.js';
import DiscordController from './controller/DiscordController.js';
import ScheduleController from './controller/ScheduleController.js';

const url = "https://www.canyon.com/de-de/mountainbike/trail-bikes/spectral/cfr/spectral-29-cfr/3193.html";

const canyonScrapeController = new CanyonScrapeController(url);
const scheduleController = new ScheduleController();
const discordController = await new DiscordController(process.env.DISCORD_TOKEN).start();

scheduleController.scheduleJob(1, async () => {
    const canyonProduct = await canyonScrapeController.scrape();

    const red = "\x1b[31m";
    const white = "\x1b[37m";
    const green = "\x1b[32m";
    const purple = "\x1b[35m";

    console.log(purple + canyonProduct.productName + white);
    canyonProduct.getAvailabilityMap().forEach((value, key) => {
        if (value !== "Bald verfügbar") {
            console.log(key + " " + green + value + white);
        } else {
            console.log(key+ " " + red + value + white);
        }
    });
});