const { AbstractController } = require("@rumsan/core/abstract");
const { ProjectModel, BeneficiariesModel, UserModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = ProjectModel;
    this.beneficiariesTable = BeneficiariesModel;
    this.userTable = UserModel;
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
    // const beneficiariesCount =  await this.beneficiariesTable.count({
    //   where:{
    //     projectId:id
    //   }
    // });
    // let {dataValues} =  await this.table.findByPk(id);
    // dataValues.beneficiariesCount=beneficiariesCount;

    // return dataValues;

    return await this.table.findByPk(id, {
      include : [{
        model : this.userTable,
        as : "users",
      }]
    });
  }
  async list() {
    return this.table.findAll({
      include : [{
        model : this.userTable,
        as : "users",
      }]
    });
  }
  async delete({ id }) {
    return this.table.destroy({ where: { id } });
  }
  async update(payload, param) {
    return this.table.update(payload, { where: { id: param.id } });
  }
};
