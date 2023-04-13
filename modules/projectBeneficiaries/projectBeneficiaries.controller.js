const { AbstractController } = require('@rumsan/core/abstract');
const { ProjectModel, BeneficiariesModel, ProjectBeneficiariesModel } = require('../models');

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = ProjectBeneficiariesModel;
    this.beneficiariesTable = BeneficiariesModel;
    this.projectTable = ProjectModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(),
    delete: (req) => this.delete(req.params),
    update: (req) => this.update(req.payload, req.params),
    getById: (req) => this.getById(req.params.id),
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

    return await this.table.findByPk(id);
  }
  async list({ limit, start, contractAddress }) {
    if (!limit) limit = 50;
    if (!start) start = 0;
    let query = {};
    if (contractAddress) {
      let project = await this.projectTable.findOne({
        where: {
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('contractAddress')),
              contractAddress?.toLowerCase()
            ),
          ],
        },
      });
      console.log(project.id);
      query.id = project.id;
    }
    return this.table.findAll({
      where: {
        ...query,
      },
      include: [
        {
          model: this.beneficiariesTable,
          as: 'beneficary_details',
          deletedAt: null,
          required: false,
        },
        {
          model: this.projectTable,
          as: 'beneficiary_project_details',
          required: false,
        },
      ],
    });
  }
  async delete({ id }) {
    return this.table.destroy({ where: { id } });
  }
  async update(payload, param) {
    return this.table.update(payload, { where: { id: param.id } });
  }
};
