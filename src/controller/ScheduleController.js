export default class ScheduleController {
    scheduleJob (minutesToWait, callback) {
        console.log("Scheduling job every " + minutesToWait + " minutes!");
        if (minutesToWait < 1) {
            return;
        }
        setInterval(callback, minutesToWait * 60 * 1000);
        callback();
    }
}