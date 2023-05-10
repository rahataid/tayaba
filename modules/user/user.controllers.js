const { UserController, RSU_EVENTS } = require('@rumsan/user');
const { Utils, RSConfig } = require('@rumsan/core');
const { Sequelize } = require('@rumsan/core').SequelizeDB;
const { UserKeyModel } = require('../models');
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
    const userKey = await this.userKeyTable.findOne({ where: { userId } });
    if (!userKey) throw Error(' User Is Invalid');
    const data = await this.loginSuccess(userId, clientIpAddress);
    data.privateKey = userKey.privateKey;

    return data;
  },

  async loginUsingWallet(signature, signPayload, { clientIpAddress }) {
    const { address } = WalletUtils.validateSignature(signature, signPayload, {
      ip: clientIpAddress,
      secret,
    });
    let user = await this.table.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('wallet_address')),
        address?.toLowerCase()
      ),
    });
    if (!user) throw Error('Invalid Wallet');
    return this.loginSuccess(user.id, clientIpAddress);
  },
};

const listeners = {};

module.exports = class extends UserController {
  constructor(options = {}) {
    options.mixins = mixins;
    options.listeners = listeners;
    super(options);
    this.userKeyTable = UserKeyModel;

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
