const { AuthRouter, RSU_EVENTS } = require("@rumsan/user");
const Controller = require("./auth.controller");
const EventHandlers = require("../eventHandlers");
const { EVENTS } = require("../../constants");

module.exports = class extends AuthRouter {
  constructor() {
    const options = {
      listeners: {
        [EVENTS.USER_ADD_OTP]: EventHandlers.mailOtp,
      },
    };

    super({
      controller: new Controller(options),
    });
    this.addRoutes({});
  }
};
