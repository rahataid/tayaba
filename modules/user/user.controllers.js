const { UserController } = require("@rumsan/user");
const Settings = require("../../helpers/settings");

module.exports = class extends UserController {
  constructor(options = {}) {
    options.mixins = {
      async loginUsingOtp(service, serviceId, otp, { clientIpAddress }) {
        const userId = await this.authController.authenticateUsingOtp(
          service,
          serviceId,
          otp
        );
        let data = await this.loginSuccess(userId, clientIpAddress);
        console.log(data.user.roles);
        if (data.user.roles?.includes("Tayaba")) {
          data.privateKey = "ssssss";
        } else {
        }
        return data;
      },
    };
    super(options);
    this.registerControllers({
      test: (req) => this.test(req),
    });
  }

  test() {
    this.emit("test-triggered", { xxx: 1 });
    return Settings.SMS();
  }
};
