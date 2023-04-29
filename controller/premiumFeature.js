const User = require("../models/user");
const Expense = require("../models/expenses");
const sequelize = require("../util/database");

const getUserLeaderBoard = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const expenses = await Expense.findAll();
    const userAggregateExpenses = {};

    expenses.forEach((expense) => {
      if (userAggregateExpenses[expense.userId]) {
        userAggregateExpenses[expense.userId] =
          userAggregateExpenses[expense.userId] + expense.amount;
      } else {
        userAggregateExpenses[expense.userId] = expense.amount;
      }
    });
    var userLeaderBoardDetails = [];
    users.forEach((user) => {
      userLeaderBoardDetails.push({
        name: user.name,
        total_cost: userAggregateExpenses[user.id] || 0,
      });
    });
    userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
    console.log(userLeaderBoardDetails);
    res.status(200).json(userLeaderBoardDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getUserLeaderBoard,
};
