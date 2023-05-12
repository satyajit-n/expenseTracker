const express = require("express");
const premiumFeatureController = require("../controller/premiumFeature");

const authenticateMiddleware = require("../middleware/auth");

const router = express.Router();

router.get(
  "/showLeaderBoard",
  authenticateMiddleware.authenticate,
  premiumFeatureController.getUserLeaderBoard
);

router.get(
  "/showExpenseBoard",
  authenticateMiddleware.authenticate,
  premiumFeatureController.getExpenseBoard
);

module.exports = router;
