const { AbstractController } = require("@rumsan/core/abstract");
const { BeneficiariesModel, ProjectModel, VillageModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = BeneficiariesModel;
    this.projectTable = ProjectModel;
    this.villageTable = VillageModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(req.query),
    getById: (req) => this.getById(req.params.id),
    update: (req) => this.update(req.params.id, req.payload),
    delete: (req) => this.delete(req.params.id),
  };

  async add(payload) {
    console.log("payload", payload);
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
    return await this.table.findByPk(id, {
      include : [{
        model : this.projectTable,
        as : "projects",
      }, {
        model : this.villageTable,
        as : "villages",
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
