const express = require("express");

const router = express.Router();

const userController = require("../controller/user");
const expenseController = require("../controller/expenses");
const userAuthentication = require("../middleware/auth");

router.post("/add-user", userController.addUser);

router.post("/login", userController.login);

router.get(
  "/get-user",
  userAuthentication.authenticate,
  userController.getUser
);

router.get(
  "/download",
  userAuthentication.authenticate,
  expenseController.downloadExpense
);
module.exports = router;
