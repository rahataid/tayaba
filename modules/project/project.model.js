const { DataTypes, Sequelize } = require('@rumsan/core').SequelizeDB;

const { AbstractModel } = require('@rumsan/core/abstract');
const { PROJECTS } = require('../../constants/dbTables');

const schema = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  budget: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  disbursed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  extras: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  projectType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  projectManager: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contractAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};
module.exports = class Project extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: PROJECTS });
  }
};
