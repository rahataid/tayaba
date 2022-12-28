const userConstants = require("@rumsan/user/constants");

module.exports = {
  ENV: {
    PRODUCTION: "production",
    DEVELOPMENT: "development",
    TEST: "test",
  },
  EMAIL_TEMPLATES: {
    USER_ADDED: {
      subject: "Welcome to our App.",
      html: `${__dirname}/../helpers/templates/user_added.html`,
    },
  },
  PERMISSIONS: {
    ...userConstants.PERMISSIONS,
  },
  EVENTS: {
    ...userConstants.EVENTS,
    USER_ADD_OTP: "otp-created",
  },
};
