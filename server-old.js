// const express = require('express');
// const cors = require('cors');
// const NodeCache = require('node-cache');
// const webPush = require('web-push');
// const { createClient } = require('redis');

// const { findAreaByName, findAreaById } = require('./search-functions');
// const { getCurrentLoadShedding } = require('./load-shedding-functions');
// const { reverseGeocoding } = require('./nominatim-api');
// const { generateIdFromCoordinates } = require('./utils/helpers');
// const { getLoadSheddingStatus } = require('./web-scraper');
// let { pushServiceEevent, currentLoadSheddingStatus } = require('./PushService');
// const SheetManager = require('./SheetManager');
// const RedisMiddleware = require('./middlewares/redisMiddleware');

// const app = express();
// const PORT = process.env.PORT;

// // const environment = process.env.NODE_ENV || 'development';
// // const config = require(`../config/${environment}.js`);

// // Middleware setup
// app.use(express.json());
// app.use(cors());
// webPush.setVapidDetails(
//     'https://example.com',
//     process.env.VAPID_PUBLIC_KEY,
//     process.env.VAPID_PRIVATE_KEY
// );

// const redisClient = createClient({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT
// });

// const init = async () => {
//     redisClient.on('error', err => console.log('Redis Client Error', err));
//     if (!redisClient.isOpen) {
//         await redisClient.connect();
//         console.log('Connected to Redis');
//     }
//     // await getLoadSheddingStatus().then(async status => {
//     //     await redisClient.set('status', status);
//     //     console.log('Load Shedding status:', status);
//     //     currentLoadSheddingStatus = status;
//     // });
// }

// init();

// const cache = new NodeCache();
// const sheetManager = new SheetManager();
// const redisMiddleware = new RedisMiddleware(redisClient);


// app.get('/', async (req, res) => {
//     res.status(200).json({
//         status: 'API running...'
//     })
// });
// /**
//  * This endpoint is for searching an area by text
//  * @param {string} area
//  */
// app.get('/search/?', redisMiddleware.checkSearchCache, async (req, res) => {
//     const { suburb } = req.query;
//     await sheetManager.extractSuburbsFromSheet(suburb)
//         .then(async results => {
//             const { suburbs } = results;
//             if (suburbs.length === 0) res.status(400);
//             else {
//                 res.status(suburbs.length != 0 ? 200 : 404)
//                     .json({
//                         suburbs
//                     });
//                 await redisClient.hSet(`search-results:${suburb}`, {
//                     suburbs: JSON.stringify(results['suburbs']).toString()
//                 });
//             }
//         });
// });
// /**
//  * This endpoint is for searching nearby areas using coordinates `latitude` and `longitude`
//  * @param {number} lat `latitude`
//  * @param {number} lon `longitude`
//  */
// app.get('/nearby/?/?', async (req, res) => {
//     const { lat, lon } = req.query;
//     const addressId = generateIdFromCoordinates({ lat: lat, lon: lon });
//     const cachedMapRequests = cache.get(addressId);
//     const suburbs = extractSuburbs();
//     if (cachedMapRequests) {
//         const { suburb, state } = cachedMapRequests['address'];
//         const searchResults = findAreaByName(suburbs, suburb);
//         res.status(200)
//             .json(searchResults);
//     } else {
//         reverseGeocoding({ lat: Number(lat), lon: Number(lon) }).then(address => {
//             const { data } = address;
//             const { suburb, state } = data['address'];
//             const searchResults = findAreaByName(suburbs, suburb);
//             cache.set(addressId, data);
//             res.json(searchResults);
//         }).catch((error) => {
//             res.status(500);
//         })
//     }
// });
// /**
//  * This endpoint is for searching an area by id
//  * @param {string} id
//  */
// app.get('/suburb/?', (req, res) => {
//     const { id } = req.query;
//     (async () => {
//         // const loadSheddingSchedule = await redisClient.hGetAll(`schedule:${id}`);
//         // if (loadSheddingSchedule) res.json(JSON.stringify(loadSheddingSchedule, null, 2));
//         // else {
//         const currentLoadSheddingStatus = await redisClient.get('status');
//         await sheetManager.extractLoadsheddingScheduleFromSheet(id).then(async data => {
//             const { schedule, area } = data;
//             const currentLoadShedding = await getCurrentLoadShedding(schedule, area, currentLoadSheddingStatus);
//             res.status(200).json(currentLoadShedding);
//             await redisClient.hSet(`schedule:${id}`, currentLoadShedding);
//         })
//         // }
//     })();
// });
// /**
//  * This endpoint is for showing current load shedding status
//  */
// app.get('/status', (req, res) => {
//     (async () => {
//         const currentLoadSheddingStatus = await redisClient.get('status');
//         res.status(200).json({
//             stage: currentLoadSheddingStatus,
//             source: 'https://loadshedding.eskom.co.za/'
//         });
//     })();
// });

// app.post('/subscribe', async (req, res) => {
//     const { subscription, areaId } = req.body;
//     pushServiceEevent.emit('subscription added', [subscription, areaId]);
//     const payload = JSON.stringify({
//         title: `Load Shedding Subscription`,
//         body: `You have successfuly subscribed for Load Shedding push service.`,
//         icon: 'https://example.com/icon.png', // URL to an icon for the notification
//         // data: {
//         //     schedule: value
//         // }
//     })
//     webPush.sendNotification(subscription, payload).then(() => {
//         res.status(201);
//     })
// });

// app.post('/send_notification', async (req, res) => {
//     const subscriber = subscribers[0];
//     webPush.sendNotification(subscriber['subscription'], 'Hello World');
//     res.json({ "statue": "Success", "message": "Message sent to push service" });
// });

// app.get('/vapidPublicKey', async (req, res) => {
//     res.send(process.env.VAPID_PUBLIC_KEY);
// })

// app.listen(PORT, () => {
//     console.log(`Server listening on Port:${PORT}`);
// });