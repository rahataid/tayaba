const { AbstractController } = require("@rumsan/core/abstract");
const { VendorModel, VillageModel, ProjectVendorsModel } = require("../models");
const {
  WalletUtils: { validateSignature },
} = require("@rumsan/core/utils");
const { RSConfig } = require("@rumsan/core");

const checkVendorWallet = (req) => {
  const { address } = validateSignature(req.headers.signature, req.headers.signpayload, {
    ip: req.info.clientIpAddress,
    secret: RSConfig.get("secret"),
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
  }

  registrations = {
    add: (req) => this.add(req.payload),
    list: (req) => this.list(req.query),
    getById: (req) => this.getById(req.params.id),
    update: (req) => this.update(req.params.id, req.payload),
    delete: (req) => this.delete(req.params.id),
    register: (req) => this.register(req),
  };

  async add(payload) {
    try {
      const venData = await this.table.create(payload);
      const {dataValues:{id:vendorId}} = venData;
      await ProjectVendorsModel.create({vendorId, projectId:payload.projectId});
      return venData;

    } catch (err) {
      console.log(err);
    }
  }

  async list(query) {
    try {
    let { limit, start, ...restQuery } = query;
    return await this.table.findAll({
      include : [{
        model : this.villageTable,
        as : 'vendor_village_details',
      }]
    });
    }
    catch(err){
      console.log(err);
    }
   
  }

  async getById(id) {
    return await this.table.findByPk(id, {
      include : [{
        model : this.villageTable,
        as : 'vendor_village_details',
      }]
    });
  }

  async update(id, payload) {
    try {
      return await this.table.update(payload, { where: { id } });
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id) {
    return this.table.destroy({ where: { id } });
  }

  register(req) {
    const { success, address } = checkVendorWallet(req);
    console.log("address", address);
  }
};
