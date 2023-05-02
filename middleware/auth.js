const jwt = require("jsonwebtoken");

const User = require('../models/user')

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    // console.log(token);
    const user = jwt.verify(
      token,
      "1e1389b8ea8f785e02def4dd5783b2d0883aa2c2af4b456de19da9b8f5b0e36e"
    );
    // console.log(user.userId)
    User.findByPk(user.userId).then((user) => {
      // console.log(JSON.stringify(user));
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};
