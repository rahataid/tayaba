const { AbstractController } = require('@rumsan/core/abstract');
const { UserKeyModel } = require('../models');

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = UserKeyModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(),
    delete: (req) => this.delete(req.params),
    update: (req) => this.update(req.payload, req.params),
  };

  async add(payload) {
    return this.table.create(payload);
  }
  async list() {
    return this.table.findAll();
  }
  async delete({ id }) {
    return this.table.destroy({ where: { id } });
  }
  async update(payload, param) {
    return this.table.update(payload, { where: { id: param.id } });
  }

  async getByUserId(userId) {
    return this.findOne({ where: { userId } });
  }
};
