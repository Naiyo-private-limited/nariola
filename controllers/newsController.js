const db = require('../models');

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, description } = req.body;
    const photo = req.file ? req.file.path : null; // Assuming you're using multer for file uploads

    const article = await db.Article.create({
      title,
      description,
      photo
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error });
  }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await db.Article.findAll({
      include: [{ model: db.Comment }]
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error });
  }
};

// Add a comment to an article
exports.addComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    
    const article = await db.Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = await db.Comment.create({
      content,
      ArticleId: articleId,
      UserId: req.user.id // Assuming you're using JWT and have user info in req.user
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Generate shareable link for an article
exports.generateShareableLink = (req, res) => {
  try {
    const { articleId } = req.params;
    const shareableLink = `myapp://news/${articleId}`; // Custom URL scheme for opening the app with a deep link
    res.status(200).json({ shareableLink });
  } catch (error) {
    res.status(500).json({ message: 'Error generating link', error });
  }
};
