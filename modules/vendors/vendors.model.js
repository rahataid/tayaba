const { DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");
const { VENDOR } = require("../../constants/dbTables");

const schema = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gender: {
    type: Sequelize.ENUM(["M", "F", "O", "U"]),
    defaultValue: "U",
  },
  phone: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  walletAddress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  walletContract: {
    type: Sequelize.STRING,
  },
  villageId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isApproved: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

  miscData: {
    type: Sequelize.JSON,
    set(v) {
      v = JSON.stringify(v);
      this.setDataValue("miscData", v);
    },
    get() {
      const v = this.getDataValue("miscData");
      return v ? JSON.parse(v) : {};
    },
  },
};
module.exports = class Vendors extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: VENDOR });
  }
};
