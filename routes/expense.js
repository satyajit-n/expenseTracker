const express = require("express");

const router = express.Router();

const expenseController = require("../controller/expenses");

router.post("/add-expense", expenseController.addExpense);

router.get("/get-expense", expenseController.getExpenses);

router.delete("/delete-expense/:id", expenseController.deleteExpense);

module.exports = router;