const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const ExpenseUser = require("./models/expense_user");

const app = express();
app.use(cors());

const expenseUserRoutes = require("./routes/expenseUser");
const expenseRoutes = require("./routes/expense");

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/expense-user", expenseUserRoutes);
app.use("/expense", expenseRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
