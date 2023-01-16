const { AbstractController } = require("@rumsan/core/abstract");
const { ProjectModel, VendorModel, ProjectVendorsModel} = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = ProjectVendorsModel;
    this.vendorTable = VendorModel;
    this.projectTable = ProjectModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(),
    delete: (req) => this.delete(req.params),
    update: (req) => this.update(req.payload, req.params),
    getById: (req) => this.getById(req.params.id)
  };

  async add(payload) {
    return this.table.create(payload);
  }
  async getById(id) {
    return await this.table.findByPk(id);
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
