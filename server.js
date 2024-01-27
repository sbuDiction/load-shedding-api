const express = require('express');
const cors = require('cors');
const { saveJSONFile } = require('./jsonFile');

// App init
const app = express();

const PORT = 5000;

// Middleware setup
app.use(express.json());
app.use(cors());

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

app.listen(PORT, () => {
    console.log(`Server listening on Port:${PORT}`);
})