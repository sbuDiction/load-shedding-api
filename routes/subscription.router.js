const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/subscription.controller');

router.get('/', SubscriptionController.subscribe);
router.get('/auth', SubscriptionController.authSubscription);


module.exports = router;