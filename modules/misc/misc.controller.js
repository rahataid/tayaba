const { AbstractController } = require("@rumsan/core/abstract");
const { MiscModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options = {}) {
    super(options);
    options.listeners = {};
    this.table = MiscModel;
  }

  registrations = {
    add: (req) => this.add(req.params.name, req.payload, req),
    getByName: (req) => this.getByName(req.params.name, req),
    getContracts: (req) => this.getContracts(),
  };

  async add(name, value) {
    return await this.table.create({ name, value });
  }

  async getByName(name) {
    let res = await this.table.findOne({
      where: { name },
    });
    return res.value;
  }
};
