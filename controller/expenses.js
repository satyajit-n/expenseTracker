const Expenses = require("../models/expenses");

exports.addExpense = async (req, res, next) => {
  try {
    const { amount, description, category } = req.body;

    const data = await Expenses.create({
      amount: amount,
      description: description,
      category: category,
    });
    res.status(201).json({ newExpenseDetails: data });
  } catch (err) {
    console.log(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const expense = await Expenses.findAll();
    res.status(200).json({ allExpenses: expense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const eId = req.params.id;
    console.log(eId);
    await Expenses.destroy({ where: { id: eId } });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};
