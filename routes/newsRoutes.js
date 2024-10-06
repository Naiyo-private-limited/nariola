const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const multer = require('multer');

// Multer for image upload
const upload = multer({ dest: 'uploads/' });

// Create a new article (no authentication needed now)
router.post('/create', newsController.createArticle);

// Get all articles (no authentication needed)
router.get('/', newsController.getAllArticles);

// Add a comment to an article (no authentication needed)
router.post('/:articleId/comments', newsController.addComment);

// Generate a shareable link (no authentication needed)
router.get('/:articleId/share', newsController.generateShareableLink);

module.exports = router;
