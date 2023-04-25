const express = require("express");

const router = express.Router();

const expenseController = require("../controller/expenseUser");

router.post("/add-user", expenseController.addUser);

router.post("/login", expenseController.login);


module.exports = router;
