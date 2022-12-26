const { DataTypes, Sequelize } = require("@rumsan/core").SequelizeDB;

const { AbstractModel } = require("@rumsan/core/abstract");
const { PROJECTS } = require("../../constants/dbTables");
const schema = {
  uuid: {
    type: DataTypes.UUID, //Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  projectManager: {
    type: DataTypes.STRING,
  },
  locations: {
    type: DataTypes.STRING,
  },
};
module.exports = class Project extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: PROJECTS });
  }
};
