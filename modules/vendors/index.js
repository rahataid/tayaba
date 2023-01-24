const Controller = require("./vendors.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");
const Validator = require("./vendors.validators");
const { PERMISSIONS } = require("../../constants");
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "vendors";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new vendor",
      // permissions: [PERMISSIONS.VENDOR_WRITE],
    },

    list: {
      method: "GET",
      path: "",
      description: "List all vendor",
      // permissions: [PERMISSIONS.VENDOR_LIST],
    },

    update: {
      method: "PUT",
      path: "/{id}",
      description: "update vendor",
      // permissions: [PERMISSIONS.VENDOR_WRITE],
    },

    delete: {
      method: "DELETE",
      path: "/{id}",
      description: "delete vendor",
      // permissions: [PERMISSIONS.VENDOR_DELETE],
    },

    getById: {
      method: "GET",
      path: "/{id}",
      description: "get vendor By Id",
      // permissions: [PERMISSIONS.VENDOR_READ],
    },

    updateVendorApprovalStatus: {
      method: "PUT",
      path: "/{id}/approval",
      description: "update vendor approval status",
      // permissions: [PERMISSIONS.VENDOR_WRITE],
    },

    register: {
      method: "GET",
      path: "/register",
      description: "register vendor",
    },
  };
};
