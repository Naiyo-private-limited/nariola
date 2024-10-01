const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../utils/authMiddleware');
const multer = require('multer');

// Multer for image upload
const upload = multer({ dest: 'uploads/' });

// Create a new article (admin role assumed)
router.post('/create', authMiddleware, upload.single('photo'), newsController.createArticle);

// Get all articles
router.get('/', newsController.getAllArticles);

// Add a comment to an article
router.post('/:articleId/comments', authMiddleware, newsController.addComment);

// Generate a shareable link
router.get('/:articleId/share', newsController.generateShareableLink);

module.exports = router;
