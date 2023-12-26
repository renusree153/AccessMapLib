'use strict';
const Sequelize = require("sequelize");
const fs = require('fs');
const path = require('path');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
//postgresql://user:password@host:port/databasename

/*
Defines the schema for the location table in the database
*/
const location = sequelize.define("location", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    deviceName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phoneModel : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phoneOS: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    accuracy: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    altitude: {
        type: Sequelize.FLOAT,
    },
    altitudeAccuracy: {
        type: Sequelize.FLOAT,
    },
    heading: {
        type: Sequelize.FLOAT,
    },
    latitude: {
        type: Sequelize.FLOAT,
    },
    longitude: {
        type: Sequelize.FLOAT,
    },
    speed: {
        type: Sequelize.FLOAT,
    },
    timestamp: {
        type: Sequelize.FLOAT,
    },
});

module.exports = location;

sequelize.sync().then(() => {
    console.log('Database synced');
  });