// node ./play/setup.js
require('../modules/services');
const config = require('config');
const { username, password, database } = config.get('db');
const SequelizeDB = require('@rumsan/core').SequelizeDB;
SequelizeDB.init(database, username, password, config.get('db'));
const { db } = SequelizeDB;
const VillageController = require('../modules/villages/villages.controller');
const Village = new VillageController();

require('../modules/models');

db.authenticate()
  .then(async () => {
    console.log('Database connected...');
    await db.sync();
    const village = await setupVillage();
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Error: ' + err);
  });
const setupVillage = async () => {
  const updateLocation1 = await Village.updateGeoLocation(
    {
      latitude: 24.62593,
      longitude: 68.62981,
    },
    { name: 'Faiz Muhammad Samejo' }
  );

  const updateLocation2 = await Village.updateGeoLocation(
    {
      latitude: 28.31456,
      longitude: 68.48329,
    },
    { name: 'Faizabad' }
  );

  const updateLocation3 = await Village.updateGeoLocation(
    {
      latitude: 25.33361111,
      longitude: 70.26972222,
    },
    { name: 'Talib Mangrio ' }
  );

  const updateLocation4 = await Village.updateGeoLocation(
    {
      latitude: 26.8348,
      longitude: 68.364521,
    },
    { name: 'Malook Shar ' }
  );

  const updateLocation5 = await Village.updateGeoLocation(
    {
      latitude: 28.11,
      longitude: 67.364521,
    },
    { name: 'Rijib Shar' }
  );

  const updateLocation6 = await Village.updateGeoLocation(
    {
      latitude: 25.11,
      longitude: 66.364521,
    },
    { name: 'Umid Ali Pitafi' }
  );

  console.log(`Villages Geo Location Updated`);
};
