import CanyonScrapeController from './controller/CanyonScrapeController.js';
import DiscordController from './controller/DiscordController.js';
import ScheduleController from './controller/ScheduleController.js';

const red = "\x1b[31m";
const white = "\x1b[37m";
const green = "\x1b[32m";
const purple = "\x1b[35m";

const url = process.env.URL;
var urlList = url.split(',');

const canyonScrapeControllerList = [];

urlList.forEach((productUrl) => {
    canyonScrapeControllerList.push(new CanyonScrapeController(productUrl));
});

const scheduleController = new ScheduleController();
const discordController = await new DiscordController(process.env.DISCORD_TOKEN).start();

const userId = process.env.USER_ID;
const forceSendInterval = process.env.NOT_AVAILABLE_SEND_INTERVAL;
let lastSend = 0;

var userIdList = userId.split(',');

await console.log(userIdList)

// schedule scrape every X minutes
const scrapeInterval = process.env.MINUTES_TO_WAIT;

scheduleController.scheduleJob(scrapeInterval, async () => {
    canyonScrapeControllerList.forEach(async product => {
        const canyonProduct = await product.scrape();

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

            userIdList.forEach((id) => {
                discordController.sendProduct(id, canyonProduct);
            });        
            console.log("Sent product to discord");
            lastSend = Date.now();
        }
    });
    
});