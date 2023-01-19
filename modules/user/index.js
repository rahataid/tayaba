const { UserRouter } = require("@rumsan/user");
const Controller = require("./user.controllers");

module.exports = class extends UserRouter {
  constructor() {
    super({
      controller: new Controller(),
    });
  }
};
