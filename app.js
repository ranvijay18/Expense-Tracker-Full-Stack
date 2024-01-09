const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const expenseRouter = require('./route/expense');
const userRouter = require('./route/user');
const orderRouter = require('./route/order');
const premiumRouter = require('./route/premium');

const User = require('./model/user');
const Expense = require('./model/expense');
const Order = require('./model/order');
const Forget = require('./model/forget');
const Download = require('./model/download');

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
)

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}))



app.use(userRouter);
app.use(expenseRouter);
app.use(orderRouter);
app.use(premiumRouter);

User.hasMany(Expense)
Expense.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User);

User.hasMany(Forget)
Forget.belongsTo(User);

User.hasMany(Download)
Download.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 5000);
})
.catch(err => {
    console.error(err);
})



