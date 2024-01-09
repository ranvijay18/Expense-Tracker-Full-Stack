const Expense = require('../model/expense');
const User = require('../model/user');
const sequelize = require('../util/database');



exports.getLeaderboard = async (req, res, next) => {
   const users = await User.findAll({
    order:[['totalExpenses', 'DESC']]
   })
    
   res.status(201).json(users);
 
   
}