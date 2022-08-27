export default class ScheduleController {
    scheduleJob (minutesToWait, callback) {
        if (minutesToWait < 1) {
            return;
        }
        setInterval(callback, minutesToWait * 60 * 1000);
        callback();
    }
}