const { UserController, RSU_EVENTS } = require('@rumsan/user');
const { Utils, RSConfig } = require('@rumsan/core');

const EventHandlers = require('../eventHandlers');
const Settings = require('../../helpers/settings');
const { ethers } = require('ethers');
const getPrivateKeys = (file) => {
  const keyFile = require(`../../config/privateKeys/${file}.json`);

  return keyFile;
};

const { CryptoUtils, WalletUtils } = Utils;
const secret = RSConfig.get('secret');

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

  async loginUsingWallet(signature, signPayload, { clientIpAddress }) {
    const { address } = WalletUtils.validateSignature(signature, signPayload, {
      ip: clientIpAddress,
      secret,
    });
    let user = await this.table.findOne({
      where: {
        wallet_address: address,
      },
    });
    return this.loginSuccess(user.id, clientIpAddress);
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
      generateSigninMessage: (req) => this.generateSigninMessage(req.info.clientIpAddress),
    });
  }

  async add(payload) {
    payload.authPayload = {
      service: 'email',
      serviceId: payload.email,
    };

    return this._add(payload);
  }

  generateSigninMessage(ip) {
    return CryptoUtils.encrypt(JSON.stringify({ ip, secret }), secret);
  }
};
