class SubscriptionService {
    /**
     * 
     */
    subscriptions = [];
    cron;
    /**
     * Push service constructor.
     * @param {[*]} subscriptions A list of all the subscriptions.
     * @param {*} cron Cron instance for scheduling notifications.
     */
    constructor(subscriptions, cron) {
        this.subscriptions = subscriptions;
        this.cron = cron;
    }
    startSubscriptionService = async () => {

    }
    /**
     * Adds a subscription to the subscriptions store
     * @param {*} subscription Subscriber
     */
    addSubscription = (subscription) => {
        this.subscriptions.push(subscription);
    }
    /**
     * Returns a subscription
     * @param {*} subscriptionKey The key associated with the subscription
     * @returns [] Subsricption
     */
    getSubscription = subscriptionKey => this.subscriptions.find(subscription => subscription['key'] === subscriptionKey);
}

module.exports = SubscriptionService;