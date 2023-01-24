const { DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");
const  { PROJECT_BENEFECIARIES } = require("../../constants/dbTables");
const schema = {
  id : {
    type : DataTypes.INTEGER,
    primaryKey: true,
    allowNull : false,
    autoIncrement : true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull : false,
  },
  beneficiaryId: {
    type: DataTypes.INTEGER,
    allowNull : false,
  },
 
};
module.exports = class ProjectBeneficiaries extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: PROJECT_BENEFECIARIES });
  }
};
