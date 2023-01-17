const { AbstractController } = require("@rumsan/core/abstract");
const { VendorModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = VendorModel;
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
      return await this.table.create(payload);
    } catch (err) {
      console.log(err);
    }
  }

  async list(query) {
    try {
    let { limit, start, ...restQuery } = query;
    return await this.table.findAll();
    }
    catch(err){
      console.log(err);
    }
   
  }

  async getById(id) {
    return await this.table.findByPk(id);
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