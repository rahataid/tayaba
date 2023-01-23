const Controller = require("./misc.controller");
const Validator = require("./misc.validator");
const { AbstractRouter } = require("@rumsan/core/abstract");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "misc";
    options.listeners = {};
    options.controller = new Controller(options);
    options.validator = new Validator(options);

    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "/{name}",
      description: "Add new data",
    },
    getByName: {
      method: "GET",
      path: "/{name}",
      description: "Get data by id",
    },

    getContracts: {
      method: "GET",
      path: "/contracts/{contract}",
      description: "Get erc20 contracts",
    },
  };
};
