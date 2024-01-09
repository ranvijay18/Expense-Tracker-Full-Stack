const Expense = require('../model/expense');
const User = require('../model/user');
const S3Services = require('../services/s3services');
const Download = require('../model/download');
let userId;
let ispremium;
let totalExpenseAmount;
let totalItems;
let rowsPerPage;

async function addExpense(id, amount) {

    const users = await User.findAll({ where: { id: id } })
    const user = users[0];

    const total = user.totalExpenses + +amount;

    user.totalExpenses = total;

    await user.save({ fields: ['totalExpenses'] });

}

async function delExpense(id, amount) {

    const users = await User.findAll({ where: { id: id } })
    const user = users[0];

    const total = user.totalExpenses - +amount;

    user.totalExpenses = total;

    await user.save({ fields: ['totalExpenses'] });
    return user.totalExpenses;

}



exports.getExpenses = async (req, res, next) => {
    userId = req.user.id;
    ispremium = req.user.ispremium;
    const rows = req.header('row');
    const row = +rows;
    totalExpenseAmount = req.user.totalExpenses;
    const page = req.params.page;
    const expenses = await Expense.findAndCountAll({where: { userId: req.user.id }})
    totalItems = expenses.count;
    const limitExpense = await Expense.findAll({
                where: {userId: req.user.id},
                order:[['id','DESC']],
                offset: (page - 1)*row,
                limit: row
            })
            res.status(201).json({ 
                detail:limitExpense, 
                user: ispremium,
                currentPage: page,
                hasNextPage: row*page < totalItems,
                nextPage: +page + 1,
                hasPreviousPage: page > 1, 
                lastPage : Math.ceil(totalItems/row),
                total: totalExpenseAmount,
                totalItems: totalItems
            });
}


exports.postExpense = async (req, res, next) => {
    const amount = req.body.amount;
    const des = req.body.des;
    const cat = req.body.cat;
    const user = userId


    await addExpense(user, amount);


    const result = await Expense.create({
        amount: amount,
        description: des,
        category: cat,
        userId: user,
    })

    res.status(201).json(result);

}

exports.getEditExpense = async (req, res, next) => {
    const expenseId = req.params.expenseId;
    const expenses = await Expense.findAll({ where: { id: expenseId, userId: userId } })
    const expense = expenses[0];
    const total = await delExpense(expense.userId, expense.amount);
    res.status(201).json({ editExpense: expenses[0] , total: total , totalItems:totalItems});

    expense.destroy();

}

exports.getDeleteExpense = async (req, res, next) => {

    try {
        const expenseId = req.params.expenseId;
        const expenses = await Expense.findAll({ where: { id: expenseId, userId: userId } });
        const expense = expenses[0];

        console.log(expense);

       const total =  await delExpense(expense.userId, expense.amount);

        res.status(201).json({ status: true, delExpense: expense, total: total, totalItems:totalItems });
        expense.destroy();
    }
    catch (err) {
        res.status(201).json({ status: false, message: "User is not Authorized!!!" });
    }

}

exports.downloadExpenses = async (req, res, next) => {
      
    try {
        const expenses = await Expense.findAll({ where: {userId: req.user.id}});


        const userID = req.user.id
        const stringifiedExpenses = JSON.stringify(expenses);
        const filename = `Expenses${userID}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
        console.log(fileURL);

        Download.create({
            fileUrl : fileURL,
            userId: req.user.id
        })  
        
        
        res.status(201).json({ fileURL, status: true , details: expenses});
    }
    catch (err) {
        console.log(err);
    }



}

exports.reportExpenses = async (req, res, next) => {
    const expenses = await Expense.findAll({ where: {userId: req.user.id}});
    const totalAmount = req.user.totalExpenses;
    const download = await Download.findAll({where: {userId : req.user.id}});
    res.status(201).json({details: expenses , totalAmount:totalAmount, download: download});
}