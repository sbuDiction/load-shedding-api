const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');


const { saveJSONFile } = require('./json-file-mananger');
const { extractCities, extractSuburbs, extractLoadsheddingScheduleFromSheet } = require('./sheet-functions');
const { findAreaByName, findAreaById } = require('./api-fuctions');
const { getUpcomingLoadSheddingSchedule, getCurrentLoadShedding } = require('./load-shedding-functions');
// const dotenv = require('env')

const blocks = require('./data/blocks.json');
const { reverseGeocoding } = require('./nominatim-api');
const { generateIdFromCoordinates } = require('./utils/helpers');
const { getLoadSheddingStatus } = require('./web-scraper');

// App init
const app = express();
const cache = new NodeCache();
const PORT = process.env.PORT;

// Middleware setup
app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.json({
        status: 'API running...'
    })
});

app.post('/api/excel/data', (req, res) => {
    /**
     * This endpoint is for receiving the blocks data coming from the spreadsheet
     */
    const { blocks } = req.body;
    const saveInstance = saveJSONFile(blocks, './data/blocks.json');
    res.json({
        status: 'Done'
    })
});

/**
 * This endpoint is for searching an area by text
 * @param {string} area
 */
app.get('/api/search/areas/?', async (req, res) => {
    const { area } = req.query;
    const suburbsList = extractSuburbs();
    const searchResults = findAreaByName(suburbsList, area);
    res.json(searchResults);
});
/**
 * This endpoint is for searching an area by id
 * @param {string} id
 */
app.get('/api/area/?', (req, res) => {
    const { id } = req.query;
    (async () => {
        const currentLoadSheddingStage = await getLoadSheddingStatus();
        const suburbs = extractSuburbs();
        const area = findAreaById(suburbs, id);
        const schedule = extractLoadsheddingScheduleFromSheet();
        const loadSheddingResults = getCurrentLoadShedding(schedule, area['block'], currentLoadSheddingStage);
        res.json(loadSheddingResults);
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
        reverseGeocoding({ lat: lat, lon: lon }).then(address => {
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


app.listen(PORT, () => {
    console.log(`Server listening on Port:${PORT}`);
});