const { DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");
const { VILLAGES } = require("../../constants/dbTables");
const schema = {
  name: {
    type: DataTypes.STRING,
    allowNull : false,
  },
  taluka: {
    type: DataTypes.STRING,
  },
  district: {
    type: DataTypes.STRING,
  },
  latitude : {
    type : DataTypes.FLOAT,
  },
  longitude : {
    type : DataTypes.FLOAT,
  },

};
module.exports = class Village extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: VILLAGES });
  }
};
