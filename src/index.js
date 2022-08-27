import CanyonScrapeController from './controller/CanyonScrapeController.js';
import ScheduleController from './controller/ScheduleController.js';

const url = "https://www.canyon.com/de-de/mountainbike/trail-bikes/spectral/cfr/spectral-29-cfr/3193.html";

const canyonScrapeController = new CanyonScrapeController(url);
const scheduleController = new ScheduleController();

scheduleController.scheduleJob(async () => {
    const productMap = await canyonScrapeController.scrape();

    const red = "\x1b[31m";
    const white = "\x1b[37m";
    const green = "\x1b[32m";

    productMap.forEach((value, key) => {
        if (value !== "Bald verfügbar") {
            console.log(key + " " + green + value + white);
        } else {
            console.log(key+ " " + red + value + white);
        }
    });
});


setInterval(() => {}, 1 << 30); // prevent exiting



