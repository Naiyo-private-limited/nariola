const db = require('../models');

const multer = require('multer');

// Set up Multer to store files in 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with original name
  }
});

// Initialize Multer with storage configuration
const upload = multer({ storage }).single('media'); // Single file upload, handled inside controller

// Controller function to handle article creation
exports.createArticle = (req, res) => {
  // First handle the file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err });
    }

    // Now handle the other form data
    const { title, description, categories } = req.body;

    try {
      // Generate the full URL for the uploaded image
      const serverIP = 'http://34.171.9.179:5000'; // Replace with your actual server IP or domain
      const mediaUrl = req.file ? `${serverIP}/uploads/${req.file.filename}` : null;

      // Create the article in the database
      const article = await db.Article.create({
        title,
        description,
        categories,
        photo: mediaUrl // Save the full URL of the image in the database
      });

      // Respond with the created article
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ message: 'Error creating article', error });
    }
  });
};


// Get all articles (No token required)
exports.getAllArticles = async (req, res) => {
  try {
    // Fetch all articles along with their comments (for performance, consider limiting comments)
    const articles = await db.Article.findAll({
      include: [{ model: db.Comment }],
    });

    res.status(200).json(articles); // Successfully fetched all articles
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error });
  }
};

// Add a comment to an article (No token required)
exports.addComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    
    // Fetch the article by its primary key
    const article = await db.Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Since we removed the token system, hardcoding a user (or use a different mechanism)
    const userId = 1; // Hardcoded user ID

    // Add a comment to the article
    const comment = await db.Comment.create({
      content,
      ArticleId: articleId,
      UserId: userId, // Hardcoded or replace with a different user-fetching logic
    });

    res.status(201).json(comment); // Successfully added the comment
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Generate shareable link for an article (No token required)
exports.generateShareableLink = (req, res) => {
  try {
    const { articleId } = req.params;
    const shareableLink = `myapp://news/${articleId}`; // Custom URL scheme for deep linking
    res.status(200).json({ shareableLink });
  } catch (error) {
    res.status(500).json({ message: 'Error generating link', error });
  }
};
