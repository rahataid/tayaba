const { UserController, RSU_EVENTS } = require('@rumsan/user');
const EventHandlers = require('../eventHandlers');
const Settings = require('../../helpers/settings');

const getPrivateKeys = (file) => {
  const keyFile = require(`../../config/privateKeys/${file}.json`);

  return keyFile;
};

const mixins = {
  async loginUsingOtp(service, serviceId, otp, { clientIpAddress }) {
    const userId = await this.authController.authenticateUsingOtp(service, serviceId, otp);
    let data = await this.loginSuccess(userId, clientIpAddress);
    if (data.user.roles?.includes('donor')) {
      let keys = getPrivateKeys('donor');

      data.privateKey = keys.privateKey;
    } else {
      let keys = getPrivateKeys('admin');

      data.privateKey = keys.privateKey;
    }
    return data;
  },
};

const listeners = {};

module.exports = class extends UserController {
  constructor(options = {}) {
    options.mixins = mixins;
    options.listeners = listeners;
    super(options);
    this.registerControllers({
      add: (req) => this.add(req.payload),
    });
  }

  async add(payload) {
    payload.authPayload = {
      service: 'email',
      serviceId: payload.email,
    };

    return this._add(payload);
  }
};
