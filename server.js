const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const XLSX = require('xlsx');
const webPush = require('web-push');


const { findAreaByName, findAreaById } = require('./api-fuctions');
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
const subscribers = [];

const excelFileManager = new ExcelFileManager(XLSX);
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
app.get('/api/search/areas/?', async (req, res) => {
    const { area } = req.query;
    const data = [];
    if (area) await sheetManager.extractSuburbsFromSheet(area)
        .then(results => {
            const { suburbs, regions } = results;
            suburbs.forEach(area => {
                const region = area['region'];
                regions[region].push(area);
            });
            for (const key in regions) {
                if (Object.hasOwnProperty.call(regions, key)) {
                    const suburbs = regions[key];
                    data.push({
                        name: key,
                        suburbs
                    });
                }
            }
            res.json(data);
        });
    else {
        res.json({
            error_msg: 'You must include the area name in your request'
        });
    }
});
/**
 * This endpoint is for searching an area by id
 * @param {string} id
 */
app.get('/api/area/?', (req, res) => {
    const { id } = req.query;
    (async () => {
        const currentLoadSheddingStage = await getLoadSheddingStatus();
        await sheetManager.extractLoadsheddingScheduleFromSheet(id).then(async data => {
            const { schedule, area } = data;
            const loadSheddingResults = await getCurrentLoadShedding(schedule, area['block'], currentLoadSheddingStage);
            console.log(loadSheddingResults);
            res.json(loadSheddingResults);
        })
    })();
});
/**
 * This endpoint is for searching nearby areas using coordinates `latitude` and `longitude`
 * @param {number} lat `latitude`
 * @param {number} lon `longitude`
 */
app.get('/api/search/nearby/area/?/?', async (req, res) => {
    const { lat, lon } = req.query;
    const addressId = generateIdFromCoordinates({ lat: lat, lon: lon });
    const cachedMapRequests = cache.get(addressId);
    const suburbs = extractSuburbs();
    if (cachedMapRequests) {
        const { suburb, state } = cachedMapRequests['address'];
        const searchResults = findAreaByName(suburbs, suburb);
        res.json(searchResults);
    } else {
        reverseGeocoding({ lat: Number(lat), lon: Number(lon) }).then(address => {
            const { data } = address;
            const { suburb, state } = data['address'];
            const searchResults = findAreaByName(suburbs, suburb);
            cache.set(addressId, data);
            res.json(searchResults);
        }).catch((error) => {
            console.error(error)
            res.status(500).json({ error: 'Internal Server Error' });
        })
    }
});
/**
 * This endpoint is for showing current load shedding status
 */
app.get('/api/status', (req, res) => {
    (async () => {
        const currentLoadSheddingStage = await getLoadSheddingStatus();
        res.json({
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
    webPush.sendNotification(subscription, payload);
    res.json({
        reason: 'Subscribed',
        status: 201
    });
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