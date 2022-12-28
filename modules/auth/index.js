const { AuthRouter, RSU_EVENTS } = require("@rumsan/user");
const Controller = require("./auth.controller");
const EventHandlers = require("../eventHandlers");

module.exports = class extends AuthRouter {
  constructor() {
    const options = {
      listeners: {
        [RSU_EVENTS.USER_ADD_OTP]: EventHandlers.mailOtp,
      },
    };

    super({
      controller: new Controller(options),
    });
    this.addRoutes({});
  }
};
