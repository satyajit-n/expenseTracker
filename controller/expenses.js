const Expenses = require("../models/expenses");
const User = require("../models/user");
const sequelize = require("../util/database");

const jwt = require("jsonwebtoken");

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    "1e1389b8ea8f785e02def4dd5783b2d0883aa2c2af4b456de19da9b8f5b0e36e"
  );
}

exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id;
    const expense = await Expenses.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: userId,
      },
      { transaction: t }
    );
    const total_cost = Number(req.user.total_cost) + Number(amount);
    const data = await User.update(
      { total_cost: total_cost },
      { where: { id: userId }, transaction: t }
    ).catch((err) => {
      throw new Error(err);
    });
    await t.commit();
    res.status(201).json({ newExpenseDetails: expense });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const expense = await Expenses.findAll({ where: { userId: req.user.id } });
    // console.log(expense);
    res.status(200).json({ allExpenses: expense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const eId = req.params.id;
    const amount = await Expenses.findOne({
      where: { id: eId },
    });
    const data = await Expenses.destroy({
      where: { id: eId, userId: req.user.id },
      transaction: t,
    });
    const total_cost = Number(req.user.total_cost) - Number(amount.amount);
    await User.update(
      { total_cost: total_cost },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    if (data === 0) {
      return res
        .status(404)
        .json({ message: "Expense doesn't belong to user" });
    }
    res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
