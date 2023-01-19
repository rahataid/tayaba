const { UserRouter, RSU_EVENTS } = require("@rumsan/user");
const Controller = require("./user.controllers");
const EventHandlers = require("../eventHandlers");

module.exports = class extends UserRouter {
  constructor() {
    const options = {
      listeners: {
        "login-success": (a) => {
          console.log("Login success", a);
        },
        [RSU_EVENTS.USER_ADD_OTP]: EventHandlers.mailOtp,
      },
    };

    super({
      controller: new Controller(options),
    });
    this.addRoutes({
      test: {
        method: "GET",
        path: "/test",
        description: "Add new Tag",
      },
    });
  }
};
