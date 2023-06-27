require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const User = require("./models/user");
const Expenses = require("./models/expenses");
const Order = require("./models/orders");
const ForgotPasswordRequests = require("./models/ForgotPasswordRequests");
const FileUploaded = require("./models/fileUploaded");

const app = express();
app.use(cors());

const UserRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premium");
const forgetPasswordRoutes = require("./routes/password");

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", UserRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumFeatureRoutes);
app.use("/password", forgetPasswordRoutes);

User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

// User.hasMany(FileUploaded);
// FileUploaded.belongsTo(User);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
