const { AbstractController } = require("@rumsan/core/abstract");
const sequelize = require("sequelize");
const {Op} = sequelize;
const { BeneficiariesModel, VillageModel, ProjectModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.tblBeneficiaries = BeneficiariesModel;
    this.tblVillages = VillageModel;
    this.tblProjects = ProjectModel;
  }

  registrations = {
    getBeneficiaryDemographicsSummary: (req) =>
      this.getBeneficiaryDemographicsSummary(req.query),

    getBeneficiaryPiechartByProject: (req) =>
      this.getBeneficiaryPiechartByProject(
        req.params.type,
        req.query.village,
        req.query.projectId
      ),
    getBeneficiaryPerVillage: (req) => this.getBeneficiaryPerVillage(req.params.id)
  };

  async getBeneficiaryDemographicsSummary(query) {
    const { count : totalBeneficiaries } = await this.tblBeneficiaries.findAndCountAll({
      where: {
        ...query,
      },
      attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "total"]],
    });
    const beneficiaryPerVillage = await this.getBeneficiaryPerVillage()

    const {count : totalProjects , rows } = await this.tblProjects.findAndCountAll({
      where: {
        ...query,
      },
      raw : true,
      attributes: [[sequelize.fn("SUM", sequelize.col("disbursed")), "totalH20Disbursed"]],
      group : ['disbursed']
    });

    const totalH20Disbursed = rows.reduce((a,b) =>  +a + +b.totalH20Disbursed, 0);

    const {count : totalVillages} = await this.tblVillages.findAndCountAll({
      where: {
        ...query,
      },
    });

  
    return { totalBeneficiaries, beneficiaryPerVillage, totalProjects : totalProjects.length, totalVillages, totalH20Disbursed };
  }

  async getBeneficiaryPerVillage() {
    const villages = await this.tblVillages.findAll();
    const beneficiaryCounts= await this.tblBeneficiaries.findAll({
      attributes: [
         'villageId',
         [this.db.Sequelize.fn('COUNT', this.db.Sequelize.col('villageId')), 'count']
       ],
      group: 'villageId',
      raw:true
     })
    const beneficiaryPerVillage = beneficiaryCounts.map(el =>{
    const vlg = villages.find((village)=>village.id === el.villageId);
    return {label: vlg.name,...el}
     })
   return beneficiaryPerVillage;
  };

  async _getPiechartDataByVillage(type, village,projectId){
    const query={
      where:{
        projectId,
      },
      raw : true
    }
    const data = await this.tblBeneficiaries.findAll(query);
    console.log("piechart", data);
    const dataValues = data.map((el) => el.dataValues);
    const benInVillage = dataValues.filter(ben => ben?.village_details === village)
    const typeSet = new Set(dataValues.map(el => el[type]));
    const typeArr = Array.from(typeSet);
    const beneficiaryPerVillageByType = typeArr.map((el) => {
      const elTypeArr = benInVillage.filter(ben => ben[type] === el)
      return { [type]: el, count: elTypeArr.length }
    }
    )
    return beneficiaryPerVillageByType;
  }


  
  async _getPiechartData(type,projectId) {  
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

  async getBeneficiaryPiechartByProject(type, village,projectId) {
    if(village) return  await this._getPiechartDataByVillage(type,village,projectId);
    const { count } = await this._getPiechartData(type, projectId);
    return count;
  }
};
