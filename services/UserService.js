const Expenses = require("../models/expenses");

const getExpenses = async (req) => {
  return Expenses.findAll({ where: { userId: req.user.id } });
};

module.exports = { getExpenses };
