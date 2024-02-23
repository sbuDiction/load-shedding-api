const express = require('express');
const cors = require('cors');

const searchRouter = require('./routes/search.router');
const scheduleRouter = require('./routes/schedule.router');
const subcriptionRouter = require('./routes/subscription.router');
const LoadSheddingStatusMonitor = require('./LoadSheddingStatusMonitor');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/search', searchRouter);
app.use('/schedule', scheduleRouter);
app.use('/subscription', subcriptionRouter);

new LoadSheddingStatusMonitor();


module.exports = app;