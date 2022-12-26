const { AbstractController } = require("@rumsan/core/abstract");
const sequelize = require("sequelize");
const { BeneficiariesModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.tblBeneficiaries = BeneficiariesModel;
  }

  registrations = {
    getBeneficiaryDemographicsSummary: (req) =>
      this.getBeneficiaryDemographicsSummary(req.query),

    getBeneficiaryPiechart: (req) =>
      this.getBeneficiaryPiechart(req.params.type),
  };

  async getBeneficiaryDemographicsSummary(query) {
    const { count, rows } = await this.tblBeneficiaries.findAndCountAll({
      where: {
        ...query,
      },
      attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "total"]],
    });
    return { count, rows };
  }

  async _getPiechartData(type) {
    const { count, rows } = await this.tblBeneficiaries.findAndCountAll({
      attributes: [type, [this.db.Sequelize.fn("COUNT", type), "count"]],
      group: [type],
    });
    return { count, rows };
  }

  async getBeneficiaryPiechart(type) {
    console.log("type", type);
    const { count } = await this._getPiechartData(type);
    return count;
  }
};
