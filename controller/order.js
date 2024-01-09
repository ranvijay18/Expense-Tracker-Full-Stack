const Rozarpay = require('razorpay');
const Order = require('../model/order');
require("dotenv").config();

exports.purchase = async (req,res,next) => {
    try{
      var rzp = new Rozarpay({
        key_id: process.env.ROZARPAY_KEY_ID,
        key_secret: process.env.ROZARPAY_SECRET_KEY
      })

      const amount = 2500;

      rzp.orders.create({amount, currency: "INR"} , (err,order) => {
        if(err){
            throw new Error(JSON.stringify(err));
        }
        req.user.createOrder({order_id: order.id, status: "PENDING"})
        .then(() => {
            return res.status(201).json({order, key_id: rzp.key_id})
        })
      })
    }
    catch(err) {
        console.log(err);
    }
}

exports.updatePremium = (req, res, next) => {
    try{
        const payment_id  = req.body.payment_id;
        const order_id = req.body.order_id;
        Order.findOne({where: {order_id : order_id}}).then(order => {
            order.update({ payment_id : payment_id, status: "SUCCESSFUL"}).then(() => {
                req.user.update({ispremium : true}).then(() => {
                    return res.status(201).json({success: true, message: "Transaction Successful"});
                }).catch(err => {
                    throw new Error(err);
                })
            }).catch(err => {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err)
        })
    }
    catch(err){
          console.log(err);
    }
}