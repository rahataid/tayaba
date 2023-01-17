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
  ...userConstants,
  PERMISSIONS: {
    ...userConstants.PERMISSIONS,
    BENEFICIARY_READ: "beneficiary-read",
    BENEFICIARY_WRITE: "beneficiary-write",
    BENEFICIARY_DELETE: "beneficiary-delete",
    BENEFICIARY_LIST: "beneficiary-list",
    PROJECT_READ: "project-read",
    PROJECT_WRITE: "project-write",
    PROJECT_DELETE: "project-delete",
    PROJECT_LIST: "project-list",
    VENDOR_READ: "vendor-read",
    VENDOR_WRITE: "vendor-write",
    VENDOR_DELETE: "vendor-delete",
    VENDOR_LIST: "vendor-list",
    REPORT_READ: "report-read",
    TRANSACTIONS_READ: "transactions_read",
  },
  EVENTS: {
    ...userConstants.EVENTS,
    USER_ADD_OTP: "otp-created",
  },
};
