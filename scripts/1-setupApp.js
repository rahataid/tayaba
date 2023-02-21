// node ./play/setup.js
require('../modules/services');
const config = require('config');
const { username, password, database } = config.get('db');
const SequelizeDB = require('@rumsan/core').SequelizeDB;
SequelizeDB.init(database, username, password, config.get('db'));
const { db } = SequelizeDB;
const { UserController, RoleController } = require('@rumsan/user');
const ProjectController = require('../modules/project/project.controller');
const { PERMISSIONS } = require('../constants');
const User = new UserController();
const Role = new RoleController();
const projectController = new ProjectController();
require('../modules/models');

const projectData = {
  name: 'H20 Wheels',
  startDate: '2023-01-24',
  endDate: '2023-01-24',
  owner: 1,
  budget: 0,
  disbursed: 0,
};

db.authenticate()
  .then(async () => {
    console.log('Database connected...');
    // await db.query(dropTables);
    await db.sync();
    console.log('setting up users');
    await setupAdmin();
    console.log('setting up project');
    await projectController.add(projectData);
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Error: ' + err);
  });
const setupAdmin = async () => {
  await Role.add({
    name: 'donor',
    permissions: [
      PERMISSIONS.APP_MANAGE,
      PERMISSIONS.USER_MANAGE,
      PERMISSIONS.ROLE_MANAGE,
      PERMISSIONS.USER_DELETE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_WRITE,
      PERMISSIONS.ROLE_READ,
      PERMISSIONS.ROLE_WRITE,
      PERMISSIONS.BENEFICIARY_READ,
      PERMISSIONS.BENEFICIARY_WRITE,
      PERMISSIONS.BENEFICIARY_DELETE,
      PERMISSIONS.BENEFICIARY_LIST,
      PERMISSIONS.PROJECT_READ,
      PERMISSIONS.PROJECT_WRITE,
      PERMISSIONS.PROJECT_DELETE,
      PERMISSIONS.PROJECT_LIST,
      PERMISSIONS.REPORT_READ,
      // PERMISSIONS.VENDOR_WRITE,
      // PERMISSIONS.VENDOR_DELETE,
      // PERMISSIONS.VENDOR_LIST,
      // PERMISSIONS.VENDOR_READ,
      // PERMISSIONS.TRANSACTIONS_READ,
    ],
  });
  await Role.add({
    name: 'admin',
    permissions: [
      PERMISSIONS.BENEFICIARY_READ,
      PERMISSIONS.BENEFICIARY_WRITE,
      PERMISSIONS.BENEFICIARY_DELETE,
      PERMISSIONS.BENEFICIARY_LIST,
      PERMISSIONS.PROJECT_READ,
      PERMISSIONS.PROJECT_WRITE,
      PERMISSIONS.PROJECT_DELETE,
      PERMISSIONS.PROJECT_LIST,
      PERMISSIONS.REPORT_READ,
      // PERMISSIONS.VENDOR_LIST,
      // PERMISSIONS.VENDOR_READ,
      // PERMISSIONS.VENDOR_DELETE,
      // PERMISSIONS.TRANSACTIONS_READ,
    ],
  });

  await Role.add({
    name: 'manager',
    permissions: [
      PERMISSIONS.BENEFICIARY_READ,
      PERMISSIONS.BENEFICIARY_WRITE,
      PERMISSIONS.BENEFICIARY_DELETE,
      PERMISSIONS.BENEFICIARY_LIST,
      PERMISSIONS.PROJECT_READ,
      PERMISSIONS.PROJECT_WRITE,
      PERMISSIONS.PROJECT_DELETE,
      PERMISSIONS.PROJECT_LIST,
      PERMISSIONS.REPORT_READ,
    ],
  });
  await Role.add({
    name: 'stakeholder',
    permissions: [
      PERMISSIONS.BENEFICIARY_READ,
      PERMISSIONS.BENEFICIARY_WRITE,
      PERMISSIONS.BENEFICIARY_DELETE,
      PERMISSIONS.BENEFICIARY_LIST,
      PERMISSIONS.PROJECT_READ,
      PERMISSIONS.PROJECT_WRITE,
      PERMISSIONS.PROJECT_DELETE,
      PERMISSIONS.PROJECT_LIST,
      PERMISSIONS.REPORT_READ,
    ],
  });
  const user1 = await User.signupUsingEmail({
    name: 'Tayaba',
    email: 'tayaba@mailinator.com',
    password: 'T$mp9670',
    roles: ['donor'],
  });

  const userTayaba = await User.signupUsingEmail({
    name: 'Tayaba H2O',
    email: 'h2o@tayaba.org',
    password: 'T$mp9670',
    roles: ['donor'],
  });

  const user2 = await User.signupUsingEmail({
    name: 'SRSO Admin',
    email: 'srso@mailinator.com',
    password: 'T$mp9670',
    roles: ['admin'],
  });

  const userSrso = await User.signupUsingEmail({
    name: 'Hamadullah [SRSO]',
    email: 'hamadullah@srso.org.pk',
    password: 'T$mp9670',
    roles: ['admin'],
  });

  const user3 = await User.signupUsingEmail({
    name: 'Will Smith',
    email: 'manager@mailinator.com',
    password: 'T$mp9670',
    roles: ['manager'],
  });

  const user4 = await User.signupUsingEmail({
    name: 'stakeholders',
    email: 'stakeholders@mailinator.com',
    password: 'T$mp9670',
    roles: ['stakeholder'],
  });
  console.log(`Users created`);
  return user1, user2, user3, user4, userSrso, userTayaba;
};
