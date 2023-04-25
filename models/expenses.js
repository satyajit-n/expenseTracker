const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Expenses = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: Sequelize.INTEGER,
  description: Sequelize.STRING,
  category: Sequelize.STRING,
});

module.exports = Expenses;
