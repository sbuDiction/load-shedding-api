class RedisMiddleware {
    redisClient = null;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    checkSearchCache = async (req, res, next) => {
        const { suburb } = req.query;
        const searchResults = await this.redisClient.hGetAll(`search-results:${suburb}`);
        if (searchResults['suburbs'] != undefined) res.status(200)
            .json({
                suburbs: JSON.parse(searchResults['suburbs'])
            });
        else {
            next();
        }
    }

    checkScheduleCache = () => { }

}

module.exports = RedisMiddleware;