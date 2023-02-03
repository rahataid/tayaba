const { AbstractController } = require('@rumsan/core/abstract');
const sequelize = require('sequelize');
const { Op, fn } = sequelize;
const {
  BeneficiariesModel,
  VillageModel,
  ProjectModel,
  ProjectBeneficiariesModel,
} = require('../models');

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.tblBeneficiaries = BeneficiariesModel;
    this.tblVillages = VillageModel;
    this.tblProjects = ProjectModel;
    this.tblProjectBeneficiaries = ProjectBeneficiariesModel;
  }

  registrations = {
    getBeneficiaryDemographicsSummary: (req) => this.getBeneficiaryDemographicsSummary(req.query),

    getBeneficiaryPiechartByProject: (req) =>
      this.getBeneficiaryPiechartByProject(req.params.type, req.query.village, req.query.projectId),
    getBeneficiaryPerVillage: (req) => this.getBeneficiaryPerVillage(req.params.id),
    getGeoMapData: (req) => this.getGeoMapData(req),
    getBeneficaryClaimsByVillage: (req) => this.getBeneficaryClaimsByVillage(req.query),
    getBarChartDataByTypeInVillages: (req) => this.getBarChartDataByTypeInVillages(req.query),
  };

  async getBeneficiaryDemographicsSummary(query) {
    const { count: totalBeneficiaries } = await this.tblBeneficiaries.findAndCountAll({
      where: {
        ...query,
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'total']],
    });
    const beneficiaryPerVillage = await this.getBeneficiaryPerVillage();

    const { count: totalProjects, rows } = await this.tblProjects.findAndCountAll({
      where: {
        ...query,
      },
      raw: true,
      attributes: [[sequelize.fn('SUM', sequelize.col('disbursed')), 'totalH20Disbursed']],
      group: ['disbursed'],
    });

    const totalH20Disbursed = rows.reduce((a, b) => +a + +b.totalH20Disbursed, 0);

    const { count: totalVillages } = await this.tblVillages.findAndCountAll({
      where: {
        ...query,
      },
    });

    return {
      totalBeneficiaries,
      beneficiaryPerVillage,
      totalProjects: totalProjects.length,
      totalVillages,
      totalH20Disbursed,
    };
  }

  async getBeneficiaryPerVillage() {
    const villages = await this.tblVillages.findAll();
    const beneficiaryCounts = await this.tblBeneficiaries.findAll({
      attributes: [
        'villageId',
        [this.db.Sequelize.fn('COUNT', this.db.Sequelize.col('villageId')), 'count'],
      ],
      group: 'villageId',
      raw: true,
    });
    const beneficiaryPerVillage = beneficiaryCounts.map((el) => {
      const vlg = villages.find((village) => village.id === el.villageId);
      return { label: vlg.name, ...el };
    });
    return beneficiaryPerVillage;
  }

  async _getPiechartDataByVillage(type, village, projectId) {
    const query = {
      where: {
        projectId,
      },
      raw: true,
      include: [
        {
          model: this.tblVillages,
          as: 'village_details',
          attributes: ['name'],
          where: {
            name: village,
          },
        },
      ],
    };
    const dataValues = await this.tblBeneficiaries.findAll(query);

    const benInVillage = dataValues.filter((ben) => ben?.village_details === village);

    const typeSet = new Set(dataValues.map((el) => el[type]));

    const typeArr = Array.from(typeSet);

    const beneficiaryPerVillageByType = typeArr.map((el) => {
      const elTypeArr = benInVillage.filter((ben) => ben[type] === el);
      return { [type]: el, count: elTypeArr.length };
    });
    return beneficiaryPerVillageByType;
  }

  async _getPiechartData(type, projectId) {
    let query = projectId
      ? {
          where: {
            projectId,
          },
        }
      : {};

    const involdedProject = await this.tblProjectBeneficiaries.findAll({
      ...query,
      raw: true,
    });

    const beneficiaryIdsInProject = involdedProject.map((el) => el.beneficiaryId);

    const { count: countValue, rows } = await this.tblBeneficiaries.findAndCountAll({
      where: {
        id: {
          [Op.in]: beneficiaryIdsInProject,
        },
      },
      attributes: [type, [fn('COUNT', sequelize.col(type)), 'count']],
      group: type,
      raw: true,
    });

    return { countValue, rows };
  }

  async getBeneficiaryPiechartByProject(type, village, projectId) {
    if (village) return await this._getPiechartDataByVillage(type, village, projectId);
    else {
      const { countValue, rows } = await this._getPiechartData(type, projectId);
      return rows.map((row) => ({
        ...row,
        count: +row.count,
      }));
    }
  }

  async getGeoMapData(req) {
    const mapInfo = await this.tblVillages.findAll({
      attributes: ['longitude', 'latitude', 'name'],
      group: ['name', 'longitude', 'latitude'],
    });
    return mapInfo;
  }

  // CLAIMED COUNTS //
  async getBeneficaryClaimsByVillage() {
    let data = await this.tblVillages.findAll({
      include: [
        {
          model: this.tblBeneficiaries,
          as: 'village_details',
          raw: true,
        },
      ],
    });
    let newArr = data.map((element, index) => {
      let claimed = 0,
        assigned = 0;
      element.village_details.forEach((ben) => {
        claimed += ben.tokensClaimed;
        assigned += ben.tokensAssigned;
      });
      return {
        id: element.id,
        name: element.name,
        claimed,
        assigned,
      };
    });

    return newArr;
  }

  async getBarChartDataByTypeInVillages({ type, village }) {
    const { id: villageId } = await this.tblVillages.findOne({
      where: {
        name: village,
      },
    });
    const data = await this.tblBeneficiaries.findAll({
      where: {
        villageId: villageId,
      },
    });
    const typeSet = new Set(data.map((el) => el[type]));
    const typeArr = Array.from(typeSet);
    const beneficiaryPerVillageByType = typeArr.map((el, i) => {
      const elTypeArr = data.filter((ben) => ben[type] === el);
      let claimed = 0,
        assigned = 0;
      elTypeArr.forEach((ben) => {
        claimed += ben.tokensClaimed;
        assigned += ben.tokensAssigned;
      });
      if (typeof el == 'boolean') {
        el ? (typeArr[i] = 'Yes') : (typeArr[i] = 'No');
      }
      return {
        data: {
          claimed,
          assigned,
        },
      };
    });
    const chartData = [
      {
        name: 'Claimed',
        data: beneficiaryPerVillageByType.map((d) => d.claimed),
      },
      {
        name: 'Assigned',
        data: beneficiaryPerVillageByType.map((d) => d.assigned),
      },
    ];
    return {
      chartLabel: typeArr,
      chartData,
    };
  }
};
