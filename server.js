const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const XLSX = require('xlsx');
const webPush = require('web-push');


const { findAreaByName, findAreaById } = require('./search-functions');
const { getCurrentLoadShedding } = require('./load-shedding-functions');
const { reverseGeocoding } = require('./nominatim-api');
const { generateIdFromCoordinates } = require('./utils/helpers');
const { getLoadSheddingStatus } = require('./web-scraper');
const ExcelFileManager = require('./ExcelFileManager');
const SheetManager = require('./SheetManager');
const { pushServiceEevent } = require('./PushService');

// App init
const app = express();
const PORT = process.env.PORT;
const PROVINCE = process.env.PROVINCE;
const cache = new NodeCache();
const loadSheddingScheduleCache = new NodeCache();
const subscribers = [];

// const excelFileManager = new ExcelFileManager(XLSX);
const sheetManager = new SheetManager();

// Middleware setup
app.use(express.json());
app.use(cors());
webPush.setVapidDetails(
    'https://example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);



app.get('/', async (req, res) => {
    res.json({
        status: 'API running...'
    })
});
/**
 * This endpoint is for searching an area by text
 * @param {string} area
 */
app.get('/search/?', async (req, res) => {
    const { suburb } = req.query;
    if (suburb) await sheetManager.extractSuburbsFromSheet(suburb)
        .then(results => {
            const { suburbs } = results;
            res.status(suburbs.length != 0 ? 200 : 404)
                .json({
                    suburbs
                });
        });
    else {
        res.status(400);
    }
});
/**
 * This endpoint is for searching nearby areas using coordinates `latitude` and `longitude`
 * @param {number} lat `latitude`
 * @param {number} lon `longitude`
 */
app.get('/nearby/?/?', async (req, res) => {
    const { lat, lon } = req.query;
    const addressId = generateIdFromCoordinates({ lat: lat, lon: lon });
    const cachedMapRequests = cache.get(addressId);
    const suburbs = extractSuburbs();
    if (cachedMapRequests) {
        const { suburb, state } = cachedMapRequests['address'];
        const searchResults = findAreaByName(suburbs, suburb);
        res.status(200)
            .json(searchResults);
    } else {
        reverseGeocoding({ lat: Number(lat), lon: Number(lon) }).then(address => {
            const { data } = address;
            const { suburb, state } = data['address'];
            const searchResults = findAreaByName(suburbs, suburb);
            cache.set(addressId, data);
            res.json(searchResults);
        }).catch((error) => {
            res.status(500);
        })
    }
});
/**
 * This endpoint is for searching an area by id
 * @param {string} id
 */
app.get('/suburb/?', (req, res) => {
    const { id } = req.query;
    (async () => {
        const cachedSchedule = loadSheddingScheduleCache.get(id);
        if (cachedSchedule) res.json(cachedSchedule);
        else {
            const currentLoadSheddingStage = await getLoadSheddingStatus();
            await sheetManager.extractLoadsheddingScheduleFromSheet(id).then(async data => {
                const { schedule, area } = data;
                const loadSheddingResults = await getCurrentLoadShedding(schedule, area, currentLoadSheddingStage);
                loadSheddingScheduleCache.set(id, loadSheddingResults);
                res.status(200).json(loadSheddingResults);
            })
        }
    })();
});
/**
 * This endpoint is for showing current load shedding status
 */
app.get('/status', (req, res) => {
    (async () => {
        const currentLoadSheddingStage = await getLoadSheddingStatus();
        res.status(200).json({
            stage: currentLoadSheddingStage,
            source: 'https://loadshedding.eskom.co.za/'
        });
    })();
});

app.post('/subscribe', async (req, res) => {
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
    webPush.sendNotification(subscription, payload).then(() => {
        res.status(201);
    })
});

app.post('/send_notification', async (req, res) => {
    const subscriber = subscribers[0];
    webPush.sendNotification(subscriber['subscription'], 'Hello World');
    res.json({ "statue": "Success", "message": "Message sent to push service" });
});

app.get('/vapidPublicKey', async (req, res) => {
    res.send(process.env.VAPID_PUBLIC_KEY);
})


app.listen(PORT, () => {
    console.log(`Server listening on Port:${PORT}`);
});