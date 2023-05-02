const express = require("express");

const router = express.Router();

const expenseController = require("../controller/expenses");
const userAuthentication = require("../middleware/auth");
const addExpenseAuthentication = require("../middleware/authAddExpense");

router.post(
  "/add-expense",
  userAuthentication.authenticate,
  expenseController.addExpense
);

router.get(
  "/get-expense",
  userAuthentication.authenticate,
  expenseController.getExpenses
);

router.delete(
  "/delete-expense/:id",
  userAuthentication.authenticate,
  expenseController.deleteExpense
);

module.exports = router;
