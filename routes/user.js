const express = require("express");

const router = express.Router();

const userController = require("../controller/user");
const userAuthentication = require("../middleware/auth");

router.post("/add-user", userController.addUser);

router.post("/login", userController.login);

router.get(
  "/get-user",
  userAuthentication.authenticate,
  userController.getUser
);

module.exports = router;
