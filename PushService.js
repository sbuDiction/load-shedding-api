const cron = require('node-cron');
const webPush = require('web-push');
const { getLoadSheddingStatus } = require('./web-scraper');
const EventEmitter = require('node:events');
const SubscriptionService = require('./SubscriptionService');
const NotificationManager = require('./NotificationManager');
webPush.setVapidDetails(
    'https://test.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

class PushServiceEvent extends EventEmitter { }

let currentLoadSheddingStage = 0;
const subscriptions = [];
const pushServiceEevent = new PushServiceEvent();
const subcriptionService = new SubscriptionService(subscriptions);
const notificationManager = new NotificationManager(subscriptions);

const main = () => {
    pushServiceEevent.on('subscription added', data => {
        let subscription = {
            areaId: data[1],
            subscription: data[0]
        }
        subcriptionService.addSubscription(subscription);
        pushServiceEevent.emit('sync');
    });

    pushServiceEevent.on('load shedding stage changed', status => {
        /**
         * TO DO!
         * If stange changes check the new schedule and update accordingly
         */
        pushServiceEevent.emit('sync');
    });

    pushServiceEevent.on('sync', () => {
        const jobs = [];
        notificationManager.upcomingNotifications().then(notifications => {
            if (jobs.length != 0) {
                console.log(`Stopping all jobs before setting up new ones`);
                jobs.forEach(job => {
                    job.stop();
                });
            }
            console.log(`Setting up notification jobs`);
            for (const [key, value] of notifications) {
                if (value.length != 0) {
                    const startTime = Number(key.split(':')[0]) - 1;
                    const cronExpression = `0 ${(startTime < 10 ? `0${startTime}` : startTime)} * * *`;
                    value.forEach(notification => {
                        const stage = notification['timeStamp']['stage'];
                        const notificationJob = cron.schedule(cronExpression, () => {
                            // Define the notification payload
                            const payload = JSON.stringify({
                                title: `Load Shedding Stage ${stage}`,
                                body: `Stage ${stage} starts in 55 minutes`,
                                icon: 'https://example.com/icon.png', // URL to an icon for the notification
                                data: {
                                    schedule: [] //value
                                }
                            });
                            console.log(`Task executed at ${startTime}:00:00`);
                            webPush.sendNotification(value['subscription'], payload).then(res => {
                                console.log('Message sent');
                            });
                            notificationJob.stop();
                        });
                    });
                }
            }
        });
    });

    // Check for load shedding stage everyday at 16:00pm
    const cronExpression = '0 16 * * *';
    cron.schedule(cronExpression, () => {
        (async () => {
            await getLoadSheddingStatus().then(status => {
                if (status !== currentLoadSheddingStage) {
                    currentLoadSheddingStage = status;
                    pushServiceEevent.emit('load shedding stage changed', status);
                }
            });
        });
    });

    // const test = ['50 15 * * *', '51 15 * * *', '52 15 * * *']
    // test.forEach(t => {
    //     cron.schedule(t, () => {
    //         console.log('Running job:', t);
    //     })
    // })
}
main();

module.exports = {
    pushServiceEevent
};