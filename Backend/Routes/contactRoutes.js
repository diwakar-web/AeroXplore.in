const express = require('express');
const router = express.Router();
const { contact } = require('../Controllers/contactController');

router.post('/contact', contact);

module.exports = router;
