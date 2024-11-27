module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    name: {
      type: DataTypes.STRING,
      allowNull: true, // Only for group chats
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    chatIdentifier: {
      type: DataTypes.STRING,
      allowNull: true, // Unique for private chats
    },
  }, {
    timestamps: true
  });

  Chat.associate = (models) => {
    // Many-to-many relationship: a chat can have many users, and a user can be in many chats
    Chat.belongsToMany(models.User, { through: 'ChatUsers', as: 'participants', foreignKey: 'chatId' });
  };

  return Chat;
};
