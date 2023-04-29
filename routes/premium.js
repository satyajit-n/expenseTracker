const express = require("express");
const premiumFeatureController = require("../controller/premiumFeature");

const authenticateMiddleware = require("../middleware/auth");

const router = express.Router();

router.get(
  "/showLeaderBoard",
  authenticateMiddleware.authenticate,
  premiumFeatureController.getUserLeaderBoard
);

module.exports = router;
