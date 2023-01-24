const { AbstractController } = require("@rumsan/core/abstract");
const { VillageModel, BeneficiariesModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = VillageModel;
    this.beneficiariesTable = BeneficiariesModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(),
    delete: (req) => this.delete(req.params),
    update: (req) => this.update(req.payload, req.params),
    getById: (req) => this.getById(req.params.id),
    getByName: (req) => this.getByName(req.params.name)

  };

  async add(payload) {
    return this.table.create(payload);
  }
  async getById(id) {
    return await this.table.findByPk(id);
  }
  async getByName(name) {
    return Project.findOne({ where: { name } });
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
};
