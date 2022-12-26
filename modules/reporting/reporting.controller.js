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

    getBeneficiaryPiechartByProject: (req) =>
      this.getBeneficiaryPiechartByProject(
        req.params.type,
        req.query.projectId
      ),
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

  async _getPiechartData(type, projectId) {
    let query = projectId
      ? {
          where: {
            projectId,
          },
        }
      : {};

    const { count, rows } = await this.tblBeneficiaries.findAndCountAll({
      ...query,
      attributes: [type, [this.db.Sequelize.fn("COUNT", type), "count"]],
      group: [type],
    });
    return { count, rows };
  }

  async getBeneficiaryPiechartByProject(type, projectId) {
    const { count } = await this._getPiechartData(type, projectId);
    return count;
  }
};
