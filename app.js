const express = require('express');
const cors = require('cors'); // For handling CORS
const dotenv = require('dotenv');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const videoRoutes = require('./routes/videoRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const liveLocationRoutes = require('./routes/liveLocation');

const path = require('path');

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS for all routes (configure it as needed)
app.use(cors());

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/loc', liveLocationRoutes);





// Sync database and start server
const PORT =  5000; // Allow port configuration via .env file

db.sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Error synchronizing the database:', err);
});

// Error handling middleware (for handling unexpected errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});

module.exports = app;
