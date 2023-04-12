const Controller = require('./projectBeneficiaries.controller');
const { AbstractRouter } = require('@rumsan/core/abstract');
const Validator = require('./projectBeneficiaries.validator');
const { PERMISSIONS } = require('../../constants');
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || 'projectsbeneficiaries';
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    list: {
      method: 'GET',
      path: '',
      description: 'List all projects beneficaries',
      // permissions: [PERMISSIONS.PROJECT_LIST],
    },
  };
};
