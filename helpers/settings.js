const { AppSettings } = require("@rumsan/core");

module.exports = {
  SMS: () => {
    return AppSettings.get("sms_api");
  },
};
