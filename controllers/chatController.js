const { Chat, User, Message } = require('../models');

// Create a chat (group or private)
exports.createChat = async (req, res) => {
  try {
    const { userIds, isGroupChat, name } = req.body;

    if (!isGroupChat && userIds.length !== 2) {
      return res.status(400).json({ error: 'Private chats require exactly two users' });
    }

    let chat = null;

    if (isGroupChat) {
      // For group chats, create a new chat with a name
      chat = await Chat.create({ isGroupChat, name });
    } else {
      // For private chats, generate a unique chatIdentifier
      const chatIdentifier = userIds.sort().join('-');

      // Check if the chat already exists
      chat = await Chat.findOne({ where: { chatIdentifier } });
      if (!chat) {
        chat = await Chat.create({ isGroupChat: false, chatIdentifier });
      }
    }

    // Add participants to chat
    const users = await User.findAll({ where: { id: userIds } });
    await chat.addParticipants(users);

    return res.status(201).json(chat);
  } catch (error) {
    console.error(error);
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
