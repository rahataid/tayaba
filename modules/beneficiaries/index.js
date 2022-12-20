const Controller = require("./beneficiaries.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "beneficiaries";
    options.controller = new Controller(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new benefs",
    },
    list: {
      method: "GET",
      path: "",
      description: "List all benefss",
      //permissions: ["note_read"],
    },
  };
};
