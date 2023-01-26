const { AbstractController } = require('@rumsan/core/abstract');
const { VendorModel, VillageModel, ProjectVendorsModel, BeneficiariesModel } = require('../models');
const {
  WalletUtils: { validateSignature },
} = require('@rumsan/core/utils');
const { RSConfig } = require('@rumsan/core');

const checkVendorWallet = (signPayload, req) => {
  const { address } = validateSignature(signPayload.signature, signPayload.signPayload, {
    ip: req.info.clientIpAddress,
    secret: RSConfig.get('secret'),
  });
  return {
    success: true,
    address,
  };
};

module.exports = class extends AbstractController {
  constructor(options) {
    super(options);
    this.table = VendorModel;
    this.villageTable = VillageModel;
    this.tblProjectVendors = ProjectVendorsModel;
    this.tblBeneficiaries = BeneficiariesModel;
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(req.query),
    getById: (req) => this.getById(req.params.id),
    update: (req) => this.update(req.params.id, req.payload),
    delete: (req) => this.delete(req.params.id),
    updateVendorApprovalStatus: (req) =>
      this.updateVendorApprovalStatus(req.params.id, req.payload),
    register: (req) => this.register(req.payload, req),
    checkIfBeneficiaryExists: (req) => this.checkIfBeneficiaryExists(req.payload.walletAddress),
  };

  async add(payload) {
    try {
      const venData = await this.table.create(payload, {
        raw: true,
      });

      await this.tblProjectVendors.create({
        projectId: payload.projectId,
        vendorId: venData.id,
      });
      return venData;
    } catch (err) {
      console.log(err);
    }
  }

  async list(query) {
    try {
      let { limit, start, ...restQuery } = query;
      return this.table.findAll({
        include: [
          {
            model: this.villageTable,
            as: 'vendor_village_details',
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getById(id) {
    return await this.table.findByPk(id, {
      include: [
        {
          model: this.villageTable,
          as: 'vendor_village_details',
        },
      ],
    });
  }

  async update(id, payload) {
    try {
      return await this.table.update(payload, { where: { id } });
    } catch (err) {
      console.log(err);
    }
  }

  async updateVendorApprovalStatus(id, payload) {
    try {
      return await this.table.update(
        {
          isApproved: payload.isApproved,
        },
        { where: { id } }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id) {
    return this.table.destroy({ where: { id } });
  }

  async findVendorByAddress(walletAddress) {
    return this.table.findOne({ where: { walletAddress } });
  }

  async register(payload, req) {
    const { signData, vendorData: vendorPayload } = payload;

    try {
      const { success, address } = checkVendorWallet(signData, req);

      if (address) {
        const vendor = await this.findVendorByAddress(address);

        if (!vendor) {
          const vendorData = {
            walletAddress: address,
            name: vendorPayload.name,
            villageId: vendorPayload.villageId,
            phone: vendorPayload.phone,
          };
          const vendor = await this.table.create(vendorData, {
            raw: true,
          });

          return {
            success,
            message: 'Vendor registered successfully',
            data: vendor,
          };
        } else {
          return {
            success,
            message: 'Vendor already registered',
          };
        }
      }
    } catch (err) {
      console.log('err', err);
      throw new Error({
        success: false,
        message: 'Something went wrong',
        error: err,
      });
    }
  }

  async checkIfBeneficiaryExists(walletAddress) {
    const beneficiary = await this.tblBeneficiaries.findOne({
      where: { walletAddress },
    });
    console.log('beneficiary', beneficiary);
    return Boolean(beneficiary);
  }
};
