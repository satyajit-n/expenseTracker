const User = require("../models/user");
const Expense = require("../models/expenses");
const sequelize = require("../util/database");

const getUserLeaderBoard = async (req, res, next) => {
  try {
    const leaderBoardOfUsers = await User.findAll({
      attributes: ["name", "total_cost"],
      order: [["total_cost", "DESC"]],
    });

    res.status(200).json(leaderBoardOfUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getExpenseBoard = async (req, res, next) => {
  try {
    const expenseBoard = await Expense.findAll({
      attributes: ["amount", "description", "category", "createdAt"],
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(expenseBoard);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getUserLeaderBoard,
  getExpenseBoard,
};
