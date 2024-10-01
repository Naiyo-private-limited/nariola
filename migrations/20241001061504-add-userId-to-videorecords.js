'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('VideoRecords', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Ensure this matches the User table name
        key: 'id'
      },
      onDelete: 'CASCADE' // Optional: delete videos if the user is deleted
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('VideoRecords', 'userId');
  }
};
