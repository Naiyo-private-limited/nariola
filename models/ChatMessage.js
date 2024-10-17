// models/ChatMessage.js

module.exports = (sequelize, DataTypes) => {
    const ChatMessage = sequelize.define('ChatMessage', {
      message: {
        type: DataTypes.STRING,
        allowNull: true,  // Messages can be empty if there is an image
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,  // This field is optional for image messages
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,  // Automatically set timestamp to current date
      },
      isMe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false  // Tracks if the message is sent by the current user
      }
    });
  
    ChatMessage.associate = (models) => {
      // A ChatMessage belongs to a sender and receiver (both are Users)
      ChatMessage.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId' });
      ChatMessage.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverId' });
    };
  
    return ChatMessage;
  };
  