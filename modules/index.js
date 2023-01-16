require("./services");
const WSService = require("@rumsan/core/services/webSocket");
const { AppSettings } = require("@rumsan/core");
const { UserRouter, RoleRouter } = require("@rumsan/user");
//const Tag = require("./tag");
const { mailOtp } = require("./eventHandlers");

const Beneficiaries = require("./beneficiaries");
const Projects = require("./project");
const Villages = require("./villages");
const _Reports = require("./reporting");
const _Auth = require("./auth");
const { EVENTS } = require("../constants");

let Routes = {
  //Tag: new Tag(),
  Auth: new _Auth(),
  Role: new RoleRouter(),
  User: new UserRouter({
    listeners: {
      [EVENTS.USER_ADD_OTP]: (otp, serviceId, service, user) => {
        mailOtp(otp, serviceId, { otp, first: user.first });
      },
    },
  }),
  AppSettings: AppSettings.Router(),
  Beneficiaries: new Beneficiaries(),
  Projects: new Projects(),
  Villages : new Villages(),
  Reports: new _Reports(),
};

module.exports = Routes;
