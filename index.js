const express = require('express');
const cors = require('cors');

const searchRouter = require('./routes/search.router');
const scheduleRouter = require('./routes/schedule.router');
const StatusRouter = require('./routes/status.router');
const subcriptionRouter = require('./routes/subscription.router');
const LoadSheddingStatusMonitor = require('./LoadSheddingStatusMonitor');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/search', searchRouter);
app.use('/schedule', scheduleRouter);
app.use('/status', StatusRouter);
app.use('/subscription', subcriptionRouter);

// Treblle middleware Starts here
useTreblle(app, {
    apiKey: process.env.apiKey,
    projectId: process.env.projectId,
})
// Treblle middleware Ends here

app.get('/', async (req, res) => {
    res.status(200).json({
        status: 'API running...'
    })
});

new LoadSheddingStatusMonitor();

module.exports = app;