'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('locations', 'deviceName', {
        type: Sequelize.STRING,
        allowNull: false, 
        defaultValue: "My iPhone" 
      }),
      queryInterface.addColumn('locations', 'phoneModel', { 
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "iPhone12"
      }),
      queryInterface.addColumn('locations', 'phoneOS', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "IOS"
      }),
      queryInterface.changeColumn('locations', 'phoneId', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "xxxx-50"
      }),
      
    ]);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
