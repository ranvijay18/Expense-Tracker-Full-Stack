const express = require('express');
const router = express.Router();

const authenticateUser = require('../middleware/auth');
const orderController = require('../controller/order');


router.get('/premium', authenticateUser.authenticate, orderController.purchase);

router.post('/premium/updatePurchase', authenticateUser.authenticate, orderController.updatePremium)


module.exports = router;