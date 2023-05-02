const Expenses = require("../models/expenses");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    "1e1389b8ea8f785e02def4dd5783b2d0883aa2c2af4b456de19da9b8f5b0e36e"
  );
}

exports.addExpense = async (req, res, next) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id;
    const expense = await Expenses.create({
      amount: amount,
      description: description,
      category: category,
      userId: userId,
    });
    const total_cost = Number(req.user.total_cost) + Number(amount);
    const data = await User.update(
      { total_cost: total_cost },
      { where: { id: userId } }
    );
    res.status(201).json({ newExpenseDetails: expense });
  } catch (err) {
    console.log(err);
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
  try {
    const eId = req.params.id;
    // console.log(eId);
    await Expenses.destroy({ where: { id: eId } });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};
