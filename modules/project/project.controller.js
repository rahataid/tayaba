const { AbstractController } = require('@rumsan/core/abstract');
const { ProjectModel, BeneficiariesModel, UserModel, VendorModel } = require('../models');
const { Sequelize } = require('@rumsan/core').SequelizeDB;

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = ProjectModel;
    this.beneficiariesTable = BeneficiariesModel;
    this.userTable = UserModel;
    this.vendorTable = VendorModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(req.query),
    delete: (req) => this.delete(req.params),
    update: (req) => this.update(req.payload, req.params),
    getById: (req) => this.getById(req.params.id),
    getByWalletAddress: (req) => this.getByWalletAddress(req.params),
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

    return await this.table.findByPk(id, {
      include: [
        {
          model: this.beneficiariesTable,
          through: {
            attributes: [],
          },
          as: 'beneficiary_details',
        },
        {
          model: this.vendorTable,
          through: {
            attributes: [],
          },
          as: 'vendor_details',
        },
        {
          model: this.userTable,
          as: 'users',
        },
      ],
    });
  }

  async getByWalletAddress({ walletAddress }) {
    return await this.table.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('wallet')),
        walletAddress?.toLowerCase()
      ),

      include: [
        {
          model: this.beneficiariesTable,
          through: {
            attributes: [],
          },
          as: 'beneficiary_details',
        },
        {
          model: this.vendorTable,
          through: {
            attributes: [],
          },
          as: 'vendor_details',
        },
        {
          model: this.userTable,
          as: 'users',
        },
      ],
    });
  }
  async list(query) {
    return this.table.findAll({
      where: query,
      include: [
        {
          model: this.beneficiariesTable,
          through: {
            attributes: [],
          },
          as: 'beneficiary_details',
        },
        {
          model: this.vendorTable,
          through: {
            attributes: [],
          },
          as: 'vendor_details',
        },
        {
          model: this.userTable,
          as: 'users',
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
