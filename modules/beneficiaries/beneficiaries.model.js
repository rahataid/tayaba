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
  },
  cnicNumber: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  address: {
    type: Sequelize.JSONB,
    set(v) {
      if (
        !(
          v.hasOwnProperty("taluka") &&
          v.hasOwnProperty("district") &&
          v.hasOwnProperty("village")
        )
      ) {
        throw new Error("district, talika and village is required");
      }

      return this.setDataValue("address", JSON.stringify(v));
    },
    get() {
      const v = this.getDataValue("address");
      return v ? JSON.parse(v) : {};
    },
    defaultValue: JSON.stringify({
      taluka: "",
      district: "",
      village: "",
    }),
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
  },
  bankAccount: {
    type: Sequelize.STRING,
  },
  isBanked: {
    type: Sequelize.BOOLEAN,
  },
  hasPhone: {
    type: Sequelize.BOOLEAN,
  },
  bankAccountType: {
    type: Sequelize.ENUM(["current", "savings"]),
  },
  dailyDistanceCovered: {
    type: Sequelize.STRING,
  },
  dailyWaterConsumption: {
    type: Sequelize.STRING,
  },
  projectId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  extras: {
    type: Sequelize.JSON,
    set(v) {
      v = JSON.stringify(v);
      this.setDataValue("extras", v);
    },
    get() {
      const v = this.getDataValue("extras");
      return v ? JSON.parse(v) : {};
    },
    // defaultValue: JSON.stringify({
    //   phoneOwnedBy: "",
    //   simRegisteredUnder: "",
    //   phoneType: "",
    //   phoneOwnerRelation: "",
    //   unionCouncil: "",
    //   relationship: "",
    //   relativeName: "",
    //   hasInternetAccess: null,
    //   bankAccount: "",
    //   dailyDistanceCovered: "",
    //   dailyWaterConsumption: "",
    // }),
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
