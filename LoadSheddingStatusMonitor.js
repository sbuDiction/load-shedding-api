const cron = require('node-cron');
const prismaClient = require("./prismaClient");
const { getLoadSheddingStatus } = require("./web-scraper");

class LoadSheddingStatusMonitor {
    constructor() {
        // this.checkCurrentStatus();
        this.monitor();
    }
    monitor = async () => {
        // Check for load shedding stage everyday at 16:00pm
        const cronExpression = '0 16 * * *';
        cron.schedule(cronExpression, () => {
            (async () => {
                console.log('Fetching load shedding status');
                await getLoadSheddingStatus().then(status => {
                    prismaClient.loadSheddingStatus.findUnique({
                        where: {
                            id: 1
                        }
                    }).then(currentStatus => {
                        if (status !== currentStatus.status) {
                            prismaClient.loadSheddingStatus.update({
                                where: {
                                    id: 1
                                },
                                data: {
                                    status: status
                                }
                            })
                            // pushServiceEevent.emit('load shedding stage changed');
                        }
                    });
                });
            });
        });
    }

    checkCurrentStatus = async () => {
        console.log('Fetching load shedding status');
        await getLoadSheddingStatus().then(status => {
            console.log('Status is:', status);
            prismaClient.loadSheddingStatus.findUnique({
                where: {
                    id: 1
                }
            }).then(currentStatus => {
                if (status !== currentStatus.status) {
                    console.log('Updating status')
                    prismaClient.loadSheddingStatus.update({
                        where: {
                            id: 1
                        },
                        data: {
                            status: status
                        }
                    }).then(res => {
                        console.log(res.status);
                    })
                    // pushServiceEevent.emit('load shedding stage changed');
                }
            });
        });
    }
}

module.exports = LoadSheddingStatusMonitor;