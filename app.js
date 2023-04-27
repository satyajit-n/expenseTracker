const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const User = require("./models/user");
const Expenses = require("./models/expenses");

const app = express();
app.use(cors());

const UserRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", UserRoutes);
app.use("/expense", expenseRoutes);

User.hasMany(Expenses);
Expenses.belongsTo(User);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
