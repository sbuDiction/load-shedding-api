const express = require('express');
const ScheduleController = require('../controllers/schedule.controller');
const TimeZoneMiddleware = require('../middlewares/timeZoneMiddleware');
const router = express.Router();

router.get('/?', TimeZoneMiddleware.checkTimeZone, ScheduleController.getUpcomingScheduleById);

module.exports = router;