const { DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");

const schema = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  txHash: {
    type: Sequelize.STRING,
  },
  benificiary: {
    type: Sequelize.STRING,
  },
  Amount: {
    type: Sequelize.INTEGER,
  },
  Ward: {
    type: Sequelize.STRING,
  },
  method: {
    type: Sequelize.ENUM(["sms", "qr"]),
  },
  mode: {
    type: Sequelize.ENUM(["online", "offline"]),
  },
};
module.exports = class TransactionsModel extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: "tblTransactions" });
  }
};
