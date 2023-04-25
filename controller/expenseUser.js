const ExpenseUser = require("../models/expense_user");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await ExpenseUser.findOne({ where: { email: email } });

    if (!userExist) {
      bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err);
        await ExpenseUser.create({
          name: name,
          email: email,
          password: hash,
        });
      });
      res.status(201).json({ message: "User Created successfully" });
    } else {
      res.status(401).json({ message: "User already Exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailExist = await ExpenseUser.findOne({
      where: { email: email },
    });
    if (emailExist) {
      bcrypt.compare(password, emailExist.password, (err, result) => {
        if (err) {
          res.status(500).json({ message: "something went wrong" });
        }
        if (result === true) {
          res.status(200).json({ message: "User login successfully" });
        } else {
          res.status(401).json({ message: "Password is incorrect" });
        }
      });
    } else {
      res.status(404).json({ message: "User not Found" });
    }
  } catch (err) {
    console.log(err);
  }
};
