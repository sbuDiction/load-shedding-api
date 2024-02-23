const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/search.controller');

// Handle the /users endpoint
router.get('/?', SearchController.searchByText);

// Add more routes for the /users endpoint as needed

module.exports = router;