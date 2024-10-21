const { Chat, User, Message } = require('../models');

// Create a chat (group or private)
exports.createChat = async (req, res) => {
  try {
    const { userIds, isGroupChat, name } = req.body;
    
    // Create chat
    const chat = await Chat.create({ isGroupChat, name });

    // Add participants to chat
    const users = await User.findAll({ where: { id: userIds } });
    await chat.addParticipants(users);

    return res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create chat' });
  }
};

// Get all chats of a user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId, {
      include: [{ model: Chat, as: 'chats' }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user.chats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve chats' });
  }
};
