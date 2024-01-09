const express = require('express');
const router = express.Router();

const expenseController = require('../controller/expense');
const authenticateUser = require('../middleware/auth');


router.get('/expense/:page' , authenticateUser.authenticate , expenseController.getExpenses);

router.post('/expense', expenseController.postExpense);

router.get('/expense/edit/:expenseId', expenseController.getEditExpense);

router.get('/expense/delete/:expenseId', expenseController.getDeleteExpense);

router.get('/download' , authenticateUser.authenticate, expenseController.downloadExpenses);

router.get('/report/expenses' , authenticateUser.authenticate, expenseController.reportExpenses);



module.exports = router;