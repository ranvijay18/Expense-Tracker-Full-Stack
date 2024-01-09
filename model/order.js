const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    payment_id: Sequelize.STRING,
    order_id : Sequelize.STRING,
    status : Sequelize.STRING,
    
})

module.exports = Order;