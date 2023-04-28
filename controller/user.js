const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ where: { email: email } });

    if (!userExist) {
      bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err);
        await User.create({
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

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    "1e1389b8ea8f785e02def4dd5783b2d0883aa2c2af4b456de19da9b8f5b0e36e"
  );
}

const token = function createToken(id, isPremium) {
  return jwt.sign(
    { userId: id, isPremium: isPremium },
    "1e1389b8ea8f785e02def4dd5783b2d0883aa2c2af4b456de19da9b8f5b0e36e"
  );
};

const  login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailExist = await User.findOne({
      where: { email: email },
    });
    // console.log(emailExist);
    if (emailExist) {
      bcrypt.compare(password, emailExist.password, (err, result) => {
        if (err) {
          res.status(500).json({ message: "something went wrong" });
        }
        // console.log(generateAccessToken(emailExist.dataValues.id));
        if (result === true) {
          res.status(200).json({
            message: "User login successfully",
            token: generateAccessToken(
              emailExist.dataValues.id,
              emailExist.dataValues.name
            ),
          });
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

module.exports = { token, addUser, login };
