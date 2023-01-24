const Controller = require("./transactions.controller");
const Validator = require("./transactions.validator");
const { AbstractRouter } = require("@rumsan/core/abstract");
const { PERMISSIONS } = require("../../constants");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "claimAcquiredERC20Transactions";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new transactions",
    },

    list: {
      method: "GET",
      path: "",
      description: "List all Transactions",
    },
  };
};
