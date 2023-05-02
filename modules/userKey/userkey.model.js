const { DataTypes, Sequelize } = require('@rumsan/core').SequelizeDB;

const { AbstractModel } = require('@rumsan/core/abstract');
const { UserModel } = require('@rumsan/user');

const schema = {
  id: {
    type: DataTypes.UUID, //Sequelize.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    unique: true,
  },
  privateKey: {
    type: Sequelize.STRING,
  },
};
module.exports = class UserKeyModel extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: 'tblUserKeys' });
  }
};
