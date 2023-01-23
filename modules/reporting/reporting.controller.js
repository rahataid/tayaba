const { AbstractController } = require("@rumsan/core/abstract");
const sequelize = require("sequelize");
const {Op} = sequelize;
const { BeneficiariesModel, VillageModel } = require("../models");

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.tblBeneficiaries = BeneficiariesModel;
    this.tblVillages = VillageModel;
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
    const { count, rows } = await this.tblBeneficiaries.findAndCountAll({
      where: {
        ...query,
      },
      attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "total"]],
    });
    const beneficiaryPerVillage = await this.getBeneficiaryPerVillage()

    return { count, rows, beneficiaryPerVillage };
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
    const data = beneficiaryCounts.map(el =>{
    const vlg = villages.find((village)=>village.id === el.villageId);
    return {label: vlg.name,...el}
     })
   return {data};

  };

  async _getPiechartDataByVillage(type, village,projectId){
    const query={
      where:{
        projectId
      }
    }
    const data = await this.tblBeneficiaries.findAll(query);
    const dataValues = data.map((el) => el.dataValues);
    const benInVillage = dataValues.filter(ben => JSON.parse(ben.address).village === village)
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
