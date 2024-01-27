const express = require('express');
const cors = require('cors');
const { saveJSONFile } = require('./jsonFile');
const { extractCities, extractSuburbs } = require('./spreadSheet');
const { findSuburb, findAreaById } = require('./searchFunctions');
const { getUpcomingLoadSheddingSchedule } = require('./loadSheddingFunctions');

const blocks = require('./data/blocks.json');

// App init
const app = express();

const PORT = 5000;

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
 * This endpoint 
 */
app.get('/api/search_areas/?', async (req, res) => {
    const { area } = req.query;
    const areasMap = new Map();
    const searchResults = [];
    const suburbsList = extractSuburbs();
    const suburbs = findSuburb(suburbsList, area);

    suburbs.forEach(suburb => {
        areasMap.set(suburb['FULL_NAME'], suburb);
    });

    const mapToJson = JSON.stringify(Object.fromEntries(areasMap));
    const results = JSON.parse(mapToJson);

    for (const key in results) {
        if (Object.hasOwnProperty.call(results, key)) {
            const suburb = results[key];
            searchResults.push({
                id: suburb['FULL_NAME'],
                name: suburb['SP_NAME'],
                block: suburb['BLOCK'],
                region: suburb['MP_NAME']
            })
        }
    }
    res.json(searchResults);
});

app.get('/api/area/?', async (req, res) => {
    const { id } = req.query;

    const suburbs = extractSuburbs();
    const area = findAreaById(suburbs, id);
    const filteredBlock = blocks.filter(block => block['blockNumber'] === area['info']['block']);

    const upcomingSchedule = getUpcomingLoadSheddingSchedule(filteredBlock[0]['schedule'])
    area['info']['schedule']['days'] = upcomingSchedule;
    res.json(area);
});

app.listen(PORT, () => {
    console.log(`Server listening on Port:${PORT}`);
})