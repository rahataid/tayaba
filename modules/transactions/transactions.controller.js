const { AbstractController } = require('@rumsan/core/abstract');
const { TransactionsModel, VendorModel, ProjectModel, BeneficiariesModel } = require('../models');

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = TransactionsModel;
    this.vendorTable = VendorModel;
    this.projectTable = ProjectModel;
    this.beneficiaryTable = BeneficiariesModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(req.query),
  };

  async add(payload) {
    return await this.table.create(payload);
  }

  async list(query) {
    let { limit, start, ...restQuery } = query;
    if (!limit) limit = 10;
    if (!start) start = 0;
    let { rows: list, count } = await this.table.findAndCountAll({
      include: [
        {
          model: this.projectTable,
          as: 'project_data',
        },
        {
          model: this.beneficiaryTable,
          as: 'beneficiary_data',
        },
        {
          model: this.vendorTable,
          as: 'vendor_data',
        },
      ],
      where: { ...restQuery },
      limit: limit,
      offset: start,
    });
    return {
      data: list,
      count,
      limit,
      start,
      totalPage: Math.ceil(count / limit),
    };
  }
};
