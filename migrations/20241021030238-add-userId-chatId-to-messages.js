'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Messages', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Name of the referenced table
        key: 'id' // Key in the referenced table
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Messages', 'chatId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Chats', // Name of the referenced table
        key: 'id' // Key in the referenced table
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Messages', 'userId');
    await queryInterface.removeColumn('Messages', 'chatId');
  }
};
