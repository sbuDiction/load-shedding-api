const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/status.controller');

// Handle the /users endpoint
router.get('/', StatusController.checkCurrentStatus);

// Add more routes for the /users endpoint as needed

module.exports = router;