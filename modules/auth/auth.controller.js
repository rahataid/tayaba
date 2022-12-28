const { AuthController } = require("@rumsan/user");
const Settings = require("../../helpers/settings");

module.exports = class extends AuthController {
  constructor(options) {
    super(options);
    this.registerControllers({});
  }

  // registrations = {
  //   ...this.registrations,
  //   ...{ test: (req) => this.test(req) },
  // };
};
