const { AbstractController } = require("@rumsan/core/abstract");
const { BeneficiariesModel, VillageModel, ProjectModel,ProjectBeneficiariesModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = BeneficiariesModel;
    this.villageTable = VillageModel;
    this.projectTable = ProjectModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),  
    list: (req) => this.list(req.query),
    getById: (req) => this.getById(req.params.id),
    update: (req) => this.update(req.params.id, req.payload),
    delete: (req) => this.delete(req.params.id),
  };

  async add(payload) {
    try {
      const benData =  await this.table.create(payload);
      const {dataValues:{id:beneficiaryId}} = benData;
      await ProjectBeneficiariesModel.create({beneficiaryId, projectId:payload.projectId});
      return benData;

    } catch (err) {
      console.log(err);
    }
  }

  async list(query) {
    let { limit, start, ...restQuery } = query;
    if (!limit) limit = 50;
    if (!start) start = 0;

    let { rows: list, count } = await this.table.findAndCountAll({
      include : [{
        model : this.villageTable,
        as : 'village_details',
      },
       {
        model : this.projectTable,
        through : {
          attributes: []

        },
        as : "beneficiary_project_details",
      },
  ],
      where: { ...restQuery },
      limit: limit || 100,
      offset: start || 0,
    });

    return {
      data: list,
      count,
      limit,
      start,
      totalPage: Math.ceil(count / limit),
    };

    // return await this.table.findAll({include : [{
    //   model : this.villageTable,
    //   as : "village_details",
    // },
    //   {
    //     model : this.projectTable,
    //     through : {
    //       attributes: []

    //     },
    //     as : "beneficiary_project_details",
    //   },
    // ]});
  }

  async getById(id) {
    return await this.table.findByPk(id, {
      include : [{
        model : this.projectTable,
        through : {
          attributes: []

        },
        as : "beneficiary_project_details",
      },
      {
        model : this.villageTable,
        as : "village_details",
      }]
    });
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
};
