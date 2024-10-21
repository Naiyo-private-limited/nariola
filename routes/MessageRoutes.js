const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');

router.post('/send', MessageController.sendMessage); // Send a message
router.get('/chat/:chatId', MessageController.getChatMessages); // Get all messages in a chat

module.exports = router;
