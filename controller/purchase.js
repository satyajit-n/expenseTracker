const Razorpay = require("razorpay");
const Order = require("../models/orders");
const UserController = require("../controller/user");

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders.create({ amount: amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log(err);
      }
      req.user
        .createOrder({ orderId: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    // console.log(payment_id,order_id)
    // const userId = req.user.dataValues.userId;
    const order = await Order.findOne({ where: { orderId: order_id } });
    // console.log(order)
    const promise1 = order.update(
      { paymentId: payment_id, status: "SUCCESSFUL" }
      // {transaction:t}
    );
    const promise2 = req.user.update(
      { isPremium: true }
      // {transaction:t}
    );
    // await Promise.all([promise1, promise2]);
    Promise.all([promise1, promise2])
      .then(() => {
        return res
          .status(202)
          .json({ success: true, message: "Transaction Successful" });
      })
      .catch((err) => {
        throw new Error(err);
      });
    // await t.commit()
    // return res.status(202).json({
    //   success: true,
    //   message: "Transaction Successful",
    //   // token: UserController.createToken(userId, true),
    // });
  } catch (err) {
    res.status (403).json({ success: false });
    console.log(err);
  }
};

exports.updatestatusfailure = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    console.log(payment_id,order_id)
    const order = await Order.findOne({ where: { orderId: order_id } });
    const promise1 = order.update(
      { paymentId: payment_id, status: "FAILED" }
      // {transaction:t}
    );
    const promise2 = req.user.update(
      { isPremium: false }
      // {transaction:t}
    );
    Promise.all([promise1, promise2])
      .then(() => {
        return res
          .status(202)
          .json({ success: true, message: "Transaction Unsuccessful" });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    res.status(403).json({ success: false });
    console.log(err);
  }
};
