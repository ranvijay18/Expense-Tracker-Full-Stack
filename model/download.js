const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Download = sequelize.define('download' , {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fileUrl: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})


module.exports = Download;