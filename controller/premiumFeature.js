const User = require("../models/user");
const Expense = require("../models/expenses");
const sequelize = require("../util/database");

const getUserLeaderBoard = async (req, res, next) => {
  try {
    const leaderBoardOfUsers = await User.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
      ],
      include: [{ model: Expense, attributes: [] }],
      group: ["user.id"],
      order: [["total_cost", "DESC"]],
    });

    res.status(200).json(leaderBoardOfUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getUserLeaderBoard,
};
