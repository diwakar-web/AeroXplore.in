const express = require('express');
const router = express.Router();
const multer = require('multer');
const articleController = require('../Controllers/articleController');
const { verifyToken, optionalAuth } = require('../Utils/authMiddleware');

// Configure multer memory storage for streaming directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, WebP, etc.) are allowed!'), false);
    }
  },
});

// Image Upload (Cloudinary)
router.post('/upload', verifyToken, upload.single('image'), articleController.uploadImage);

// Article CRUD
router.get('/articles', articleController.getAllArticles);
router.post('/articles', verifyToken, articleController.createArticle);
router.get('/articles/my', verifyToken, articleController.getMyArticles);
router.get('/articles/:id', optionalAuth, articleController.getArticleById);
router.put('/articles/:id', verifyToken, articleController.updateArticle);
router.delete('/articles/:id', verifyToken, articleController.deleteArticle);

module.exports = router;
