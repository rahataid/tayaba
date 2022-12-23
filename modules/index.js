require("./services");
const WSService = require("@rumsan/core/services/webSocket");
const { AppSettings } = require("@rumsan/core");
const {
  UserRouter,
  AuthRouter,
  RoleRouter,
  RSU_EVENTS,
} = require("@rumsan/user");
//const Tag = require("./tag");
const { mailOtp } = require("./eventHandlers");

const Beneficiaries = require("./beneficiaries");
const _Reports = require("./reporting");

let Routes = {
  //Tag: new Tag(),
  Auth: new AuthRouter(),
  Role: new RoleRouter(),
  User: new UserRouter({
    listeners: {
      [RSU_EVENTS.USER_ADD_OTP]: (otp, serviceId, service, user) => {
        mailOtp(otp, serviceId, { otp, first: user.first });
      },
    },
  }),
  AppSettings: AppSettings.Router(),
  Beneficiaries: new Beneficiaries(),
  Reports: new _Reports(),
};

module.exports = Routes;
