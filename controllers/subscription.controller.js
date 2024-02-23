const webPush = require('web-push');
const { pushServiceEevent } = require("../PushService");

class SubscriptionController {
    static subscribe = async (req, res) => {
        const { subscription, areaId } = req.body;
        pushServiceEevent.emit('subscription added', [subscription, areaId]);
        const payload = JSON.stringify({
            title: `Load Shedding Subscription`,
            body: `You have successfuly subscribed for Load Shedding push service.`,
            icon: 'https://example.com/icon.png', // URL to an icon for the notification
            // data: {
            //     schedule: value
            // }
        })
        await webPush.sendNotification(subscription, payload).then(() => {
            res.status(201);
        })
    }

    static authSubscription = async (req, res) => {
        res.status(200).send(process.env.VAPID_PUBLIC_KEY);
    }
}

module.exports = SubscriptionController;