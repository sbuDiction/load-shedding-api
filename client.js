// const { } = require('redis-om')
const { createClient } = require('redis');

/* create and open the Redis OM Client */
const redisClient = createClient({ url: process.env.REDIS_URL, database: 0 });

const startRedis = async () => {
    redisClient.on('error', err => console.log('Redis Client Error', err));
    await redisClient.connect();
    console.log('Redis connected');
}



module.exports = redisClient;

