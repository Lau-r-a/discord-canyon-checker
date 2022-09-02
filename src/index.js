import mongoose from 'mongoose';

import CanyonScrapeController from './controller/CanyonScrapeController.js';
import DiscordController from './controller/DiscordController.js';
import ScheduleController from './controller/ScheduleController.js';
import ServiceFacade from './controller/ServiceFacade.js';
import UserController from './controller/UserController.js';

const mongoUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongoPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
await mongoose.connect('mongodb://' + mongoUser + ':' + mongoPassword + '@mongo/', { useNewUrlParser: true });

const userController = new UserController();
const scheduleController = new ScheduleController();
const discordController = await new DiscordController(process.env.DISCORD_TOKEN, process.env.DISCORD_APPLICATION_ID).start();
const canyonScrapeController = new CanyonScrapeController();

//init service facade managing all services
const facade = new ServiceFacade(discordController, userController, scheduleController, canyonScrapeController);

// schedule scrape every X minutes
const scrapeInterval = process.env.MINUTES_TO_WAIT;
const forceSendHours = process.env.NOT_AVAILABLE_SEND_INTERVAL_HOURS;

facade.start(scrapeInterval);




