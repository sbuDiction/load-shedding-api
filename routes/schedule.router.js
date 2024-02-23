const express = require('express');
const ScheduleController = require('../controllers/schedule.controller');
const TimeZoneMiddleware = require('../middlewares/timeZoneMiddleware');
const router = express.Router();

// Handle the /users endpoint
router.get('/?', TimeZoneMiddleware.checkTimeZone, ScheduleController.getUpcomingScheduleById);

// Add more routes for the /users endpoint as needed

module.exports = router;