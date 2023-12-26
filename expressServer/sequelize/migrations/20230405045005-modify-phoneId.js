'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all ([
      queryInterface.removeColumn('locations', 'phoneId'),
      queryInterface.addColumn('locations', 'phoneId', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "IOS"
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
