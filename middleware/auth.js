const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticate = (req, res, next) =>{
    try{
       const token = req.header('Authorization');
       const user = jwt.verify(token, 'secretkey');
       User.findByPk(user.userId)
       .then(user => {
        console.log(JSON.stringify(user));
        req.user = user;
        next();
       })
       .catch(err => {
        console.log(err);
       })
    }
    catch(err){
       return res.status(401).json({success: false});
    }
}


module.exports = {authenticate};