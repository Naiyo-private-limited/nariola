'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add a unique identifier column for private chats
    await queryInterface.addColumn('Chats', 'chatIdentifier', {
      type: Sequelize.STRING,
      allowNull: true, // Only used for private chats
      unique: true, // Ensure uniqueness for private chats
    });

    // Optional: Recreate unique index if necessary
    await queryInterface.addConstraint('Chats', {
      fields: ['chatIdentifier'],
      type: 'unique',
      name: 'unique_chat_identifier',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the chatIdentifier column
    await queryInterface.removeColumn('Chats', 'chatIdentifier');
  },
};
