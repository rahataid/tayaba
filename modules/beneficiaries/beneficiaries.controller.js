const { Sequelize } = require('@rumsan/core').SequelizeDB;
const { AbstractController } = require('@rumsan/core/abstract');
const {
  BeneficiariesModel,
  VillageModel,
  ProjectModel,
  ProjectBeneficiariesModel,
} = require('../models');

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = BeneficiariesModel;
    this.villageTable = VillageModel;
    this.projectTable = ProjectModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(req.query),
    getByWalletAddress: (req) => this.getByWalletAddress(req.params.walletAddress),
    update: (req) => this.update(req.params.id, req.payload),
    updateStatus: (req) => this.updateStatus(req.params.address, req.payload.isActive),
    updateUsingWalletAddress: (req) =>
      this.updateUsingWalletAddress(req.params.walletAddress, req.payload),
    overrideBenBalance: (req) => this.overrideBenBalance(req.params.walletAddress, req.payload),
    delete: (req) => this.delete(req.params),
    getVillagesName: (req) => this.getVillagesName(),
    assignProject: (req) => this.assignProject(req.params.id, req.payload.projectId),
  };

  async add(payload) {
    const benData = await this.table.create(payload);
    const {
      dataValues: { id: beneficiaryId },
    } = benData;
    if (payload.projectId) {
      await ProjectBeneficiariesModel.create({ beneficiaryId, projectId: payload.projectId });
    }
    return benData;
  }

  async list(query) {
    let {
      limit,
      start,
      projectId,
      id: beneficiaryId,
      village,
      tokensAssigned,
      tokensClaimed,
      ...restQuery
    } = query;

    if (!limit) limit = 50;
    if (!start) start = 0;

    const projectQuery = {};
    const villageQuery = {};
    const tokensAssignedQuery = {};
    const tokensClaimedQuery = {};

    if (projectId) {
      projectQuery.id = projectId;
    }

    if (village) {
      villageQuery.name = village;
    }

    if (tokensAssigned === 'true') {
      tokensAssignedQuery.tokensAssigned = {
        [Sequelize.Op.gt]: 0,
      };
    }

    if (tokensClaimed === 'true') {
      tokensClaimedQuery.tokensClaimed = {
        [Sequelize.Op.gt]: 0,
      };
    }

    let { rows: list, count } = await this.table.findAndCountAll({
      where: {
        deletedAt: null,
      },
      include: [
        {
          model: this.villageTable,
          where: villageQuery,
          as: 'village_details',
          deletedAt: null,
          required: false,
        },
        {
          model: this.projectTable,
          where: projectQuery,
          as: 'beneficiary_project_details',
          required: false,
        },
      ],
      where: { ...restQuery, ...tokensAssignedQuery, ...tokensClaimedQuery, deletedAt: null },
      order: [['name', 'ASC']],
      limit: limit || 100,
      offset: start || 0,
    });

    return {
      data: list,
      count,
      limit,
      start,
      totalPage: Math.ceil(count / limit),
    };
  }

  async getByWalletAddress(walletAddress) {
    return this.table.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('walletAddress')),
        walletAddress?.toLowerCase()
      ),
      include: [
        {
          model: this.projectTable,
          through: {
            attributes: [],
          },
          as: 'beneficiary_project_details',
        },
        {
          model: this.villageTable,
          as: 'village_details',
        },
      ],
    });
  }

  async updateStatus(walletAddress, isActive) {
    return this.table.update(
      { isActivated: isActive },
      {
        where: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('walletAddress')),
          walletAddress?.toLowerCase()
        ),
        new: true,
        returning: true,
        raw: true,
      }
    );
  }

  async update(id, payload) {
    return this.table.update(payload, { where: { id } });
  }

  async updateUsingWalletAddress(walletAddress, payload) {
    const beneficiary = await this.table.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('walletAddress')),
        walletAddress?.toLowerCase()
      ),
    });

    if (payload.tokensAssigned) {
      payload.tokensAssigned = +beneficiary.tokensAssigned + +payload.tokensAssigned;
    }

    if (payload.tokensClaimed) {
      payload.tokensAssigned =
        beneficiary.tokensAssigned > 0
          ? +beneficiary.tokensAssigned - +payload.tokensClaimed
          : beneficiary.tokensAssigned;

      payload.tokensClaimed = +beneficiary.tokensClaimed + +payload.tokensClaimed;
    }

    return this.table.update(payload, {
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('walletAddress')),
        walletAddress?.toLowerCase()
      ),
      returning: true,
      raw: true,
    });
  }

  async overrideBenBalance(walletAddress, payload) {
    return this.table.update(payload, {
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('walletAddress')),
        walletAddress?.toLowerCase()
      ),
      returning: true,
      raw: true,
    });
  }

  async delete({ walletAddress }) {
    return this.table.update(
      { deletedAt: String(new Date().getTime()) },
      { where: { walletAddress } }
    );
  }

  async getVillagesName() {
    const villageData = await this.table.findAll({
      include: [
        {
          model: this.villageTable,
          as: 'village_details',
        },
      ],
    });
    const uniqueVillages = [...new Set(villageData.map((item) => item?.village_details.name))];
    return uniqueVillages;
  }
  async assignProject(beneficiaryId, projectId) {
    return ProjectBeneficiariesModel.create({ beneficiaryId, projectId });
  }
};
