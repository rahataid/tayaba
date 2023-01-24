const Controller = require("./villages.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");
const Validator = require("./villages.validator");
const { PERMISSIONS } = require("../../constants");
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "villages";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new villages",
      permissions: [PERMISSIONS.PROJECT_WRITE],
    },

    list: {
      method: "GET",
      path: "",
      description: "List all villages",
      permissions: [PERMISSIONS.PROJECT_LIST],
    },

    update: {
      method: "PUT",
      path: "/{id}",
      description: "update  villages",
      permissions: [PERMISSIONS.PROJECT_WRITE],
    },

    delete: {
      method: "DELETE",
      path: "/{id}",
      description: "delete villge",
      permissions: [PERMISSIONS.PROJECT_DELETE],
    },

    getById: {
      method: "GET",
      path: "/{id}",
      description: "get Village By Id",
      permissions: [PERMISSIONS.PROJECT_READ],
    },
  };
};
