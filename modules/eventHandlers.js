const config = require("../helpers/config");
const { DataUtils } = require("@rumsan/core/utils");
const { MailService } = require("@rumsan/core/services");
const { EMAIL_TEMPLATES } = require("../constants/index");
const WSService = require("@rumsan/core/services/webSocket");
const axios = require("axios");

module.exports = {
  async mailOtp(otp, to, user) {
    MailService.send({
      to,
      template: EMAIL_TEMPLATES.USER_ADDED,
      data: Object.assign(DataUtils.convertToJson(user), { otp }),
    });
    if (config.isDebug && config.debug.discord)
      axios.post(config.debug.discord, { content: `OTP: ${otp} | ${to} [${config.app.name}]` });
  },
};
