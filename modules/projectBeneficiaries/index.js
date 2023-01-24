const Controller = require("./projectBeneficiaries.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");
const Validator = require("./projectBeneficiaries.validator");
const { PERMISSIONS } = require("../../constants");
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "projectBeneficiaries";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new projectBeneficiaries relation",
      permissions: [PERMISSIONS.PROJECT_WRITE],
    },

    list: {
      method: "GET",
      path: "",
      description: "List all projectBeneficiaries relation",
      permissions: [PERMISSIONS.PROJECT_LIST],
    },

    update: {
      method: "PUT",
      path: "/{id}",
      description: "update  projectBeneficiaries relation",
      permissions: [PERMISSIONS.PROJECT_WRITE],
    },

    delete: {
      method: "DELETE",
      path: "/{id}",
      description: "delete projectBeneficiaries relation by id",
      permissions: [PERMISSIONS.PROJECT_DELETE],
    },

    getById: {
      method: "GET",
      path: "/{id}",
      description: "get projectBeneficiaries relation By Id",
      permissions: [PERMISSIONS.PROJECT_READ],
    },
  };
};
