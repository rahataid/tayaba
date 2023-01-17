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
    type: Sequelize.STRING,
  },
  walletAddress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cnicNumber: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  phoneOwnedBy: {
    type: Sequelize.STRING,
  },
  simRegisteredUnder: {
    type: Sequelize.STRING,
  },
  phoneType: {
    type: Sequelize.ENUM(["smartphone", "featurephone", "dumbphone"]),
    set(v) {
      if (v) {
        this.setDataValue("hasPhone", true);
      }
      this.setDataValue("phoneType", v);
    },
  },
  phoneOwnerRelation: {
    type: Sequelize.STRING,
  },
  unionCouncil: {
    type: Sequelize.STRING,
  },
  relationship: {
    type: Sequelize.STRING,
  },
  relativeName: {
    type: Sequelize.STRING,
  },
  hasInternetAccess: {
    type: Sequelize.BOOLEAN,
    allowNull : false,
    defaultValue : false
  },
  bankAccount: {
    type: Sequelize.STRING,
  },
  isBanked: {
    type: Sequelize.BOOLEAN,
    allowNull : false,
    defaultValue : false
  },
  hasPhone: {
    type: Sequelize.BOOLEAN,
    allowNull : false,
    defaultValue : false
  },
  bankAccountType: {
    type: Sequelize.ENUM(["current", "savings"]),
  },
  dailyDistanceCovered: {
    type: Sequelize.INTEGER,
  },
  dailyWaterConsumption: {
    type: Sequelize.INTEGER,
  },
  projectId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  villageId : {
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

  email: {
    type: Sequelize.STRING,
  },
};
module.exports = class Beneficiaries extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: "tblBeneficiaries" });
  }
};
