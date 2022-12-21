const { DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");

const schema = {
  id: {
    type: DataTypes.UUID, //Sequelize.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
  name: {
    type: Sequelize.STRING
  },
  phone : {
    type : Sequelize.STRING
  },
  wallet_address : {
    type : Sequelize.STRING
  },
  email : {
    type : Sequelize.STRING
  },
  address : {
    type : Sequelize.STRING
  },
  address_temporary : {
    type : Sequelize.STRING
  },
  gender : {
    type : Sequelize.STRING
  }

};
module.exports = class Beneficiaries extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: "tblBeneficiaries" });
  }
};
