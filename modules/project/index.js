const Controller = require('./project.controller');
const { AbstractRouter } = require('@rumsan/core/abstract');
const Validator = require('./project.validator');
const { PERMISSIONS } = require('../../constants');
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || 'projects';
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: 'POST',
      path: '',
      description: 'Add new project',
      permissions: [PERMISSIONS.PROJECT_WRITE],
    },

    list: {
      method: 'GET',
      path: '',
      description: 'List all projects',
      // permissions: [PERMISSIONS.PROJECT_LIST],
    },

    update: {
      method: 'PUT',
      path: '/{id}',
      description: 'update  project',
      permissions: [PERMISSIONS.PROJECT_WRITE],
    },

    delete: {
      method: 'DELETE',
      path: '/{id}',
      description: 'delete project',
      permissions: [PERMISSIONS.PROJECT_DELETE],
    },

    getById: {
      method: 'GET',
      path: '/{id}',
      description: 'get Project By Id',
      permissions: [PERMISSIONS.PROJECT_READ],
    },

    getByWalletAddress: {
      method: 'GET',
      path: '/wallet/{walletAddress}',
      description: 'get Project By Wallet',
      permissions: [PERMISSIONS.PROJECT_READ],
    },
  };
};
