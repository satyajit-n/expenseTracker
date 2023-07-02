const Expenses = require("../models/expenses");
const User = require("../models/user");
const FileUploaded = require("../models/fileUploaded");
const sequelize = require("../util/database");
const UserServices = require("../services/UserService");
const UploadToS3Services = require("../services/S3Services");

const jwt = require("jsonwebtoken");

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    "1e1389b8ea8f785e02def4dd5783b2d0883aa2c2af4b456de19da9b8f5b0e36e"
  );
}

exports.downloadExpense = async (req, res, next) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringFyExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expenses${userId}/${new Date()}.txt`;

    const fileUrl = await UploadToS3Services.uploadToS3(
      stringFyExpenses,
      filename
    );
    await FileUploaded.create({ URL: fileUrl, UserId: userId });
    res.status(200).json({ fileUrl: fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "" });
  }
};

exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id;
    const expense = await Expenses.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: userId,
      },
      { transaction: t }
    );
    const total_cost = Number(req.user.total_cost) + Number(amount);
    const data = await User.update(
      { total_cost: total_cost },
      { where: { id: userId }, transaction: t }
    ).catch((err) => {
      throw new Error(err);
    });
    await t.commit();
    res.status(201).json({ newExpenseDetails: expense });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    let ITEMS_PER_PAGE = Number(req.query.ITEMS_PER_PAGE);
    let page = Number(req.query.page) || 1;
    let totalItems;

    await Expenses.count({ where: { userId: req.user.id } })
      .then((total) => {
        totalItems = total;
        return Expenses.findAll({
          offset: (page - 1) * 4,
          limit: ITEMS_PER_PAGE,
          where: { userId: req.user.id },
        });
      })
      .then((expense) => {
        res.json({
          expenses: expense,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          nextPage: page + 1,
          hasPreviousPage: page > 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const eId = req.params.id;
    const amount = await Expenses.findOne({
      where: { id: eId },
    });
    const data = await Expenses.destroy({
      where: { id: eId, userId: req.user.id },
      transaction: t,
    });
    const total_cost = Number(req.user.total_cost) - Number(amount.amount);
    await User.update(
      { total_cost: total_cost },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    if (data === 0) {
      return res
        .status(404)
        .json({ message: "Expense doesn't belong to user" });
    }
    res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
