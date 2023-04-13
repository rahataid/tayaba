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
    update: (req) => this.update(req.payload, req.query),
    getById: (req) => this.getById(req.params.id),
    getByContractAddress: (req) => this.getByContractAddress(req.params),
    approveProject: (req) =>
      this.approveProject(req.params.contractAddress, req.payload.isApproved),
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

  async getByContractAddress({ contractAddress }) {
    return await this.table.findOne({
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('contractAddress')),
            contractAddress?.toLowerCase()
          ),
          { deletedAt: null },
        ],
      },

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
    let where;

    if (query) {
      where = query;
    }

    where.deletedAt = null;

    return this.table.findAll({
      where,
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
  async delete({ contractAddress }) {
    return this.table.update(
      { deletedAt: String(new Date().getTime()) },
      { where: { contractAddress } }
    );
  }
  async update(payload, param) {
    return this.table.update(payload, { where: { ...param } });
  }

  async approveProject(contractAddress, isApproved) {
    return this.table.update(
      {
        isApproved,
      },
      {
        where: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('contractAddress')),
          contractAddress?.toLowerCase()
        ),
      }
    );
  }
};
