const Controller = require("./beneficiaries.controller");
const Validator = require("./beneficiaries.validators");
const { AbstractRouter } = require("@rumsan/core/abstract");

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "beneficiaries";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new beneficiaries",
    },

    list: {
      method: "GET",
      path: "",
      description: "List all beneficiaries",
      //permissions: ["note_read"],
    },

    getById : {
      method : "GET",
      path: "/{id}",
      description : "get beneficiaries by id"
    },

    update : {
      method : "PATCH",
      path : "/{id}",
      description : "update beneficiaries by id"
    }, 

    delete : {
      method : "DELETE",
      path : "/{id}",
      description : "delete beneficiaries by id"
    }
  };
};
