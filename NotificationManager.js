const SheetManager = require("./SheetManager");
const { getCurrentLoadShedding } = require("./load-shedding-functions");
const { getLoadSheddingStatus } = require("./web-scraper");

/**
 * This is for maping time 
 */
const timeMapValues = [
    ['00:00:00', []],
    ['01:00:00', []],
    ['02:00:00', []],
    ['03:00:00', []],
    ['04:00:00', []],
    ['05:00:00', []],
    ['06:00:00', []],
    ['07:00:00', []],
    ['08:00:00', []],
    ['09:00:00', []],
    ['10:00:00', []],
    ['11:00:00', []],
    ['12:00:00', []],
    ['13:00:00', []],
    ['14:00:00', []],
    ['15:00:00', []],
    ['16:00:00', []],
    ['17:00:00', []],
    ['18:00:00', []],
    ['19:00:00', []],
    ['20:00:00', []],
    ['21:00:00', []],
    ['22:00:00', []],
    ['23:00:00', []],
];

class NotificationManager {
    subscriptions = [];
    schedules = new Map(timeMapValues);

    constructor(subscriptions) {
        this.subscriptions = subscriptions;
    }
    /**
     * 
     */
    upcomingNotifications = (currentLoadSheddingStatus) => new Promise(resolve => {
        const lastSubscription = this.subscriptions.length - 1;
        const subscription = this.subscriptions[lastSubscription];
        new SheetManager()
            .extractLoadsheddingScheduleFromSheet(subscription['areaId'])
            .then(async data => {
                const { schedule, area } = data;
                // await getLoadSheddingStatus().then(stage => {
                getCurrentLoadShedding(schedule, area['block'], currentLoadSheddingStatus)
                    .then(loadsheddingSchedule => {
                        loadsheddingSchedule['schedule'].forEach(timeStamp => {
                            let mapKey = timeStamp['start'];
                            const addNotification = [...this.schedules.get(mapKey), { timeStamp, subscription }]
                            this.schedules.set(mapKey, addNotification);
                        });
                        resolve(this.schedules);
                    });
                // });
            });
    });

    syncNotifications = () => new Promise(resolve => {
        this.upcomingNotifications().then((notifications) => {
            resolve(notifications);
        });
    });

    getNotifications = () => {
        return this.subscriptions;
    }
}

module.exports = NotificationManager;