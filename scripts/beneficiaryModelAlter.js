require('../modules/services');
const config = require('config');

const { username, password, database } = config.get('db');
const SequelizeDB = require('@rumsan/core').SequelizeDB;
SequelizeDB.init(database, username, password, config.get('db'));
const { db } = SequelizeDB;

const AppSettings = require('@rumsan/core').AppSettings;

require('@rumsan/core/appSettings/model')();
require('../modules/models');

const alterBeneficiaryTable = async () => {
  await db.query(`
     ALTER TABLE "tblBeneficiaries"
         ADD COLUMN "deletedAt" varchar ;
        
    `);
};

db.authenticate()
  .then(async () => {
    console.log('Database connected...');
    await alterBeneficiaryTable();
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Error: ' + err);
  });
