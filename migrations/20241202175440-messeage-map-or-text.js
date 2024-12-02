'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('messages', 'map', {
      type: Sequelize.JSON, // Use JSON if the "map" is structured data
      allowNull: true, // Set to true if the column can be null
    });

    await queryInterface.addColumn('messages', 'text', {
      type: Sequelize.TEXT, // Use TEXT for long text content
      allowNull: true, // Set to true if the column can be null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('messages', 'map');
    await queryInterface.removeColumn('messages', 'text');
  },
};
