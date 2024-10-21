const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

router.post('/create', ChatController.createChat); // Create new chat
router.get('/user/:userId', ChatController.getUserChats); // Get all chats for a user

module.exports = router;
