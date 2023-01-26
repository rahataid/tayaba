//backend-see setup
// node ./play/setup.js
require('../modules/services');
const config = require('config');

const { username, password, database } = config.get('db');
const SequelizeDB = require('@rumsan/core').SequelizeDB;
SequelizeDB.init(database, username, password, config.get('db'));
const { db } = SequelizeDB;
const { UserController, RoleController } = require('@rumsan/user');

const User = new UserController();
const Role = new RoleController();

const AppSettings = require('@rumsan/core').AppSettings;

require('@rumsan/core/appSettings/model')();
require('../modules/models');

const dropTables = `
  DROP TABLE IF EXISTS "tblAppSettings";
  DROP TABLE IF EXISTS "tblRoles";
  DROP TABLE IF EXISTS "tblAuths";
  DROP TABLE IF EXISTS "tblProjectVendors";
  DROP TABLE IF EXISTS "tblProjectBeneficiaries";
  DROP TABLE IF EXISTS "tblTransactions";
  DROP TABLE IF EXISTS "tblBeneficiaries";
  DROP TABLE IF EXISTS "tblProjects";
  DROP TABLE IF EXISTS "tblVendors";
  DROP TABLE IF EXISTS "tblUsers";
  DROP TABLE IF EXISTS "tblVillages";
`;

const settingsData = {
  publicExample: {
    value: { appName: 'My App Name', walletAddress: '0x00' },
    isPrivate: false,
  },
  privateExample: {
    value: { api_key: '2dsfds234', url: 'https://test.com' },
  },
  simpleExample: 'test data',
};

db.authenticate()
  .then(async () => {
    console.log('Database connected...');
    await db.query(dropTables);
    await db.sync();
    console.log('Setup complete...');
    await addSettings();
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Error: ' + err);
  });

const addSettings = async () => {
  await AppSettings.init(db);
  await AppSettings.controller._addBulk(settingsData);
  await AppSettings.refresh();
};
