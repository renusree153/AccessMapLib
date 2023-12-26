const express = require('express')
const http = require('http');
const {Sequelize, DataTypes} = require('sequelize');
const location = require('./sequelize/models/location');
const app = express()
app.use(express.json())
const fs = require('fs');
const path = require('path');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/sequelize/config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/*
GET method that returns "Hi!" when directed to this route
*/
app.get('/', (req, res) => {
    res.send("Hi!")
})

/*
GET method that returns a list of collected locations from the database
when directed to this route
*/
app.get('/Locations', async(req, res)=> {
    const locations = await location.findAll();
    res.json(locations);
})

/*
POST method that retrieves the new location values 
from the request body and puts them in the location table
of the database. Returns a success status code if succeeded,
else returns an error message 
*/
app.post('/locationsPost', async(req,res) => {
    const {deviceName, phoneModel, phoneOS, accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed, timestamp} = req.body;
    try {
        const newLoc = await location.create({deviceName, phoneModel, phoneOS, accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed, timestamp});
        res.status(201).json(newLoc);
    }
    catch (error) {
        console.log(error.message);
        console.log("FAILED creating a new location");
        res.status(500).json({error: 'Creating a new location failed'});
    }
})

app.listen(3000)