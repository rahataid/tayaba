const Controller = require("./projectVendors.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");
const Validator = require("./projectVendors.validator");
const { PERMISSIONS } = require("../../constants");
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "projectVendors";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new projectVendors relation",
      permissions: [PERMISSIONS.PROJECT_WRITE],
    },

    list: {
      method: "GET",
      path: "",
      description: "List all projectVendors relation",
      permissions: [PERMISSIONS.PROJECT_LIST],
    },

    update: {
      method: "PUT",
      path: "/{id}",
      description: "update  projectVendors relation",
      permissions: [PERMISSIONS.PROJECT_WRITE],
    },

    delete: {
      method: "DELETE",
      path: "/{id}",
      description: "delete projectVendors relation by Id",
      permissions: [PERMISSIONS.PROJECT_DELETE],
    },

    getById: {
      method: "GET",
      path: "/{id}",
      description: "get projectVendors relation By Id",
      permissions: [PERMISSIONS.PROJECT_READ],
    },
  };
};
