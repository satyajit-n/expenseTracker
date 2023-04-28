const express = require("express");

const router = express.Router();

const userController = require("../controller/user");

router.post("/add-user", userController.addUser);

router.post("/login", userController.login);

// router.get("/get-user", userController.getUser);

module.exports = router;
