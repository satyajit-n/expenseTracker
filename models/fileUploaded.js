const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const FileUploaded = sequelize.define("fileuploads", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  URL: Sequelize.STRING,
  UserId: Sequelize.INTEGER,
});

module.exports = FileUploaded;
