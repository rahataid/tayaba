const Controller = require("./project.controller");
const { AbstractRouter } = require("@rumsan/core/abstract");
const Validator = require("./project.validator");
module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || "projects";
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    add: {
      method: "POST",
      path: "",
      description: "Add new project",
    },
    list: {
      method: "GET",
      path: "",
      description: "List all projects",
      //permissions: ["note_read"],
    },
    update: {
      method: "PUT",
      path: "/{id}",
      description: "update  project",
    },
    delete: {
      method: "DELETE",
      path: "/{id}",
      description: "delete project",
    },
  };
};
