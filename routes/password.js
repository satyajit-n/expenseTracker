const express = require("express");

const router = express.Router();

const forgetPasswordController = require("../controller/forgetPassword");
const userAuthentication = require("../middleware/auth");

router.post("/forget-password", forgetPasswordController.forgetPassword);

router.get("/resetpassword/:id", forgetPasswordController.resetpassword);

router.get(
  "/updatepassword/:resetpasswordid",
  forgetPasswordController.updatepassword
);

module.exports = router;
