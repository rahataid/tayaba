const { DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");

const schema = {
  id: {
   type : Sequelize.INTEGER,
   primaryKey : true,
   autoIncrement: true,
   allowNull : false
  },

  name: {
    type: Sequelize.STRING,
    allowNull : false,
  },

  gender : {
    type : Sequelize.ENUM,
    values : ['male', 'female', 'others']
  },

  phone : {
    type : Sequelize.STRING
  },

  walletAddress : {
    type : Sequelize.STRING
  },

  cnicNumber : {
    type : Sequelize.STRING
  },

  address : {
    type : Sequelize.JSON,
  },

  extras : {
    type : Sequelize.JSON,
    },

  email : {
    type : Sequelize.STRING,
  },

};
module.exports = class Beneficiaries extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: "tblBeneficiaries" });
  }
};
