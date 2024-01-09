const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user' , {
    id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    ispremium: Sequelize.BOOLEAN,
    totalExpenses: Sequelize.INTEGER
})

module.exports = User;