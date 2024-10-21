module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      timestamps: true,
      underscored: true // Use snake_case for all automatically generated columns

    });
  
    Message.associate = (models) => {
      // A message belongs to a user (sender)
      Message.belongsTo(models.User, { as: 'sender', foreignKey: 'userId' }); // Explicitly use 'userId'
      
      // A message belongs to a chat
      Message.belongsTo(models.Chat, { foreignKey: 'chatId' }); // Explicitly use 'chatId'
    };
    
  
    return Message;
  };
  