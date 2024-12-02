const { Message, Chat, User } = require('../models');

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, recipientIds, content, isGroupChat, chatName, map, text } = req.body;

    let chat;

    // Group chat check
    if (isGroupChat) {
      chat = await Chat.findOne({
        where: { isGroupChat: true, name: chatName },
        include: [{
          model: User,
          as: 'participants',
          where: { id: recipientIds.concat(senderId) }
        }]
      });
    } else {
      // One-on-one chat check
      chat = await Chat.findOne({
        where: { isGroupChat: false },
        include: [{
          model: User,
          as: 'participants',
          where: { id: [senderId, ...recipientIds] }
        }]
      });
    }

    // If no chat found, create a new one
    if (!chat) {
      chat = await Chat.create({ isGroupChat, name: chatName || null });
      const users = await User.findAll({ where: { id: recipientIds.concat(senderId) } });
      await chat.addParticipants(users);
    }

    // Create the message with content, map, and text
    const message = await Message.create({
      content,
      userId: senderId,
      chatId: chat.id,
      map,  // Add the map field here
      text  // Add the text field here
    });

    return res.status(201).json({ message, chat });

  } catch (error) {
    console.error('Error sending message:', error.message); // Log the error message
    return res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
};


  

// Get all messages in a chat
// Get all messages in a chat
exports.getChatMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.findAll({
      where: { chatId },
      include: [
        { model: User, as: 'sender', attributes: ['username', 'email'] },
      ],
      attributes: ['content', 'map', 'text', 'createdAt', 'updatedAt'] // Include map and text in the response
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error.message); // Log the error message
    return res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Get messages between two users (direct chat)
// Get messages between two users (direct chat)
exports.getDirectChatMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    // Find the chat involving the two users (one-on-one chat)
    const chat = await Chat.findOne({
      where: { isGroupChat: false },
      include: [{
        model: User,
        as: 'participants',
        where: { id: [senderId, receiverId] }
      }]
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found between the two users.' });
    }

    // Get messages for the found chat
    const messages = await Message.findAll({
      where: { chatId: chat.id },
      include: [
        { model: User, as: 'sender', attributes: ['username', 'email'] },
      ],
      attributes: ['content', 'map', 'text', 'createdAt', 'updatedAt'] // Include map and text in the response
    });

    return res.status(200).json(messages);

  } catch (error) {
    console.error('Error retrieving messages:', error.message); // Log the error message
    return res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

  