const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ForgotPasswordRequests = sequelize.define("ForgotPasswordRequests", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isActive: Sequelize.BOOLEAN,
  userId: Sequelize.INTEGER,
});

module.exports = ForgotPasswordRequests;
