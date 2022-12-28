const { AbstractController } = require("@rumsan/core/abstract");
const { ProjectModel,BeneficiariesModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = ProjectModel;
    this.beneficiariesTable = BeneficiariesModel;
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
    const beneficiariesCount =  await this.beneficiariesTable.count({
      where:{
        projectId:id
      }
    });
    let {dataValues} =  await this.table.findByPk(id);
    dataValues.beneficiariesCount=beneficiariesCount;

    return dataValues;
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
