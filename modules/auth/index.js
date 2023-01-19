const { AuthRouter } = require("@rumsan/user");
const Controller = require("./auth.controller");
module.exports = class extends AuthRouter {
  constructor() {
    super({
      controller: new Controller({}),
    });
    this.addRoutes({});
  }
};
