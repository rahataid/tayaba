const { AbstractController } = require("@rumsan/core/abstract");
const { VendorsModel } = require("../models");
const {
  WalletUtils: { validateSignature },
} = require("@rumsan/core/utils");
const { RSConfig } = require("@rumsan/core");

const checkVendorWallet = (req) => {
  const { address } = validateSignature(req.headers.signature, req.headers.signpayload, {
    ip: req.info.clientIpAddress,
    secret: RSConfig.get("secret"),
  });
  return {
    success: true,
    address,
  };
};

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = VendorsModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(req.query),
    getById: (req) => this.getById(req.params.id),
    update: (req) => this.update(req.params.id, req.payload),
    delete: (req) => this.delete(req.params.id),
    register: (req) => this.register(req),
  };

  async add(payload) {
    try {
      return await this.table.create(payload);
    } catch (err) {
      console.log(err);
    }
  }

  async list(query) {
    let { limit, start, ...restQuery } = query;
    if (!limit) limit = 50;
    if (!start) start = 0;
    // checkToken(req);
    let { rows: list, count } = await this.table.findAndCountAll({
      where: { ...restQuery },
      limit: limit || 100,
      offset: start || 0,
      raw: true,
    });
    // const list = await this.table.findAll({});
    return {
      data: list,
      count,
      limit,
      start,
      totalPage: Math.ceil(count / limit),
    };
  }

  async getById(id) {
    return await this.table.findByPk(id);
  }

  async update(id, payload) {
    try {
      return await this.table.update(payload, { where: { id } });
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id) {
    return this.table.destroy({ where: { id } });
  }

  register(req) {
    const { success, address } = checkVendorWallet(req);
    console.log("address", address);
  }
};
