const { DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");

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
    type: Sequelize.INTEGER,
  },
  walletAddress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contractAddress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  villageId: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
    super({ tableName: "tblVendors" });
  }
};
