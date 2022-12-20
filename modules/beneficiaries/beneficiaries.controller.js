const { AbstractController } = require("@rumsan/core/abstract");
const { BeneficiariesModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = BeneficiariesModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
  };

  async add(payload) {
    await this.table.create(payload);
  }
};
