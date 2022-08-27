import schedule from 'node-schedule';

export default class ScheduleController {
    scheduleJob (callback, minutesToWait) {
        schedule.scheduleJob('* \\'+ minutesToWait +' * * *', () => {
            callback();
        });
    }
}