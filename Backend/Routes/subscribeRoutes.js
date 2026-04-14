const express = require('express');
const router = express.Router();
const { subscribe, notifySubscribers, getSubscribers } = require('../Controllers/subscribeController');

router.post('/subscribe', subscribe);
router.post('/notify-subscribers', notifySubscribers);
router.get('/subscribers', getSubscribers);

module.exports = router;
