const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');

router.post('/send', MessageController.sendMessage); // Send a message
router.get('/chat/:chatId', MessageController.getChatMessages); // Get all messages in a chat
router.get('/direct', MessageController.getDirectChatMessages); // Get all messages between two users


module.exports = router;
