const express = require("express");

const router = express.Router();

const forgetPasswordController = require("../controller/forgetPassword");
const userAuthentication = require("../middleware/auth");

router.post("/forget-password", forgetPasswordController.forgetPassword);

module.exports = router;
