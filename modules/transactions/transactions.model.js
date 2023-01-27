const { DataTypes, Sequelize } = require('@rumsan/core').SequelizeDB;

const { AbstractModel } = require('@rumsan/core/abstract');

const schema = {
  txHash: {
    type: Sequelize.STRING,
  },
  contractAddress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  timestamp: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  beneficiaryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  vendorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  projectId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isOffline: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  txType: {
    type: Sequelize.ENUM(['sms', 'qr', 'wallet']),
  },
};
module.exports = class TransactionsModel extends AbstractModel {
  schema = schema;
  constructor() {
    super({ tableName: 'tblTransactions' });
  }
};
