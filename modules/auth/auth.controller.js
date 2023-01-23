const { AuthController, RSU_EVENTS } = require("@rumsan/user");
const Settings = require("../../helpers/settings");
const EventHandlers = require("../eventHandlers");
const { EVENTS } = require("../../constants");

module.exports = class extends AuthController {
  constructor(options = {}) {
    options.listeners = {
      [EVENTS.USER_ADD_OTP]: EventHandlers.mailOtp,
    };
    super(options);
    this.registerControllers({});
  }

  // registrations = {
  //   ...this.registrations,
  //   ...{ test: (req) => this.test(req) },
  // };
};
