import CanyonScrapeController from './controller/CanyonScrapeController.js';
import DiscordController from './controller/DiscordController.js';
import ScheduleController from './controller/ScheduleController.js';

const url = "https://www.canyon.com/de-de/mountainbike/trail-bikes/spectral/cfr/spectral-29-cfr/3193.html";

const canyonScrapeController = new CanyonScrapeController(url);
const scheduleController = new ScheduleController();
const discordController = await new DiscordController(process.env.DISCORD_TOKEN).start();

const userId = process.env.USER_ID;
const forceSendInterval = process.env.NOT_AVAILABLE_SEND_INTERVAL;
let lastSend = 0;

// schedule scrape every 6 minutes
scheduleController.scheduleJob(6, async () => {
    const canyonProduct = await canyonScrapeController.scrape();

    const red = "\x1b[31m";
    const white = "\x1b[37m";
    const green = "\x1b[32m";
    const purple = "\x1b[35m";

    console.log(purple + canyonProduct.productName + white);

    let isAvailable = false;

    //TODO: Rework to save last state and only send once if availability changed
    canyonProduct.getAvailabilityMap().forEach((value, key) => {
        if (value !== "Bald verfügbar") {
            console.log(key + " " + green + value + white);
            isAvailable = true;
        } else {
            console.log(key + " " + red + value + white);
        }
    });

    if (isAvailable || (Date.now() - lastSend > 1000 * 60 * 60 * forceSendInterval)) {
        discordController.sendProduct(userId, canyonProduct);
        console.log("Sent product to discord");
        lastSend = Date.now();
    }
});