const express = require('express');
const router = express.Router();
const { getBlogStats, voteBlog } = require('../Controllers/blogStatController');

router.get('/blog-stats/:blogId', getBlogStats);
router.post('/blog-stats/vote', voteBlog);

module.exports = router;
