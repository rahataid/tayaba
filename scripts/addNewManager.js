// node ./play/setup.js
require('../modules/services');
const config = require('config');
const { username, password, database } = config.get('db');
const SequelizeDB = require('@rumsan/core').SequelizeDB;
SequelizeDB.init(database, username, password, config.get('db'));
const { db } = SequelizeDB;
const { UserController } = require('@rumsan/user');
const User = new UserController();

require('../modules/models');

const { address: adminAddress } = require('../config/privateKeys/admin.json');

db.authenticate()
  .then(async () => {
    console.log('Database connected...');
    // await db.query(dropTables);
    await db.sync();
    console.log('setting up users');
    await setupAdmin();
    console.log('setting up project');
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Error: ' + err);
  });
const setupAdmin = async () => {
  const manager = await User.signupUsingEmail({
    name: 'Rahat Manager',
    email: 'handler@mailinator.com',
    password: 'T$mp9670',
    roles: ['admin'],
    wallet_address: adminAddress,
  });
  console.log('manager', manager);
};
