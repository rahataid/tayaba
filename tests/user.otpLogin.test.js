const config = require("../helpers/config");

const { username, password, database } = config.db;
const SequelizeDB = require("@rumsan/core").SequelizeDB;
SequelizeDB.init(database, username, password, config.db);

const { RSConfig } = require("@rumsan/core");
RSConfig.set(config.app);

const { AuthController } = require("@rumsan/user");
const UserController = require("../modules/user/user.controllers");

const user = new UserController();
const auth = new AuthController();

describe.only("User OTP Tests", function () {
  let usrEmail = "tayaba@mailinator.com";

  it("should create login otp", async () => {
    let _authData = await auth.getOtpForService("email", usrEmail);
    console.log("_authData", _authData);

    let userData = await user.loginUsingOtp(
      "email",
      usrEmail,
      _authData.otp.code,
      { clientIpAddress: "127.0.0.1" }
    );
    expect(userData.user.email).toBe(usrEmail);
  });
});
