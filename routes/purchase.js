const express = require("express");
const router = express.Router();

const purchaseController = require("../controller/purchase");
const authenticateMiddleware = require("../middleware/auth");

router.get(
  "/premiummembership",
  authenticateMiddleware.authenticate,
  purchaseController.purchasePremium
);
router.post(
  "/updatetransactionstatus",
  authenticateMiddleware.authenticate,
  (req, res, next) => {
    console.log("req==========================>", req);
    next();
  },
  purchaseController.updateTransactionStatus
);

router.post(
  "/updatestatusfailure",
  authenticateMiddleware.authenticate,
  (req, res, next) => {
    console.log("req==========================>", req);
    next();
  },
  purchaseController.updatestatusfailure
);

module.exports = router;
