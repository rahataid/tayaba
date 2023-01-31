require('@rumsan/user').initModels();
const UserModel = require('./user/user.model');
const TagModel = require('./tag/tag.model');
const BeneficiariesModel = require('./beneficiaries/beneficiaries.model');
const ProjectModel = require('./project/project.model');
const VillageModel = require('./villages/villages.model');
const VendorModel = require('./vendors/vendors.model');
const ProjectBeneficiariesModel = require('./projectBeneficiaries/projectBeneficiaries.model');
const ProjectVendorsModel = require('./projectVendors/projectVendors.model');
const TransactionsModel = require('./transactions/transactions.model');

const MiscModel = require('./misc/misc.model');

let modelFactory = {
  TagModel: new TagModel().init(),
  UserModel: new UserModel().init(),
  BeneficiariesModel: new BeneficiariesModel().init(),
  ProjectModel: new ProjectModel().init(),
  VillageModel: new VillageModel().init(),
  ProjectBeneficiariesModel: new ProjectBeneficiariesModel().init(),
  ProjectVendorsModel: new ProjectVendorsModel().init(),
  TransactionsModel: new TransactionsModel().init(),
  VendorModel: new VendorModel().init(),
  MiscModel: new MiscModel().init(),
};

/**********************************************************
 * All the table associations belong here
 **********************************************************/
const createAssociations = (models) => {
  // Beneficiary + Village
  models.BeneficiariesModel.belongsTo(models.VillageModel, {
    foreignKey: {
      name: 'villageId',
      allowNull: false,
    },
    as: 'village_details',
    onDelete: 'CASCADE',
  });

  models.VillageModel.hasMany(models.BeneficiariesModel, {
    foreignKey: {
      name: 'villageId',
      allowNull: false,
    },
    as: 'village_details',
    onDelete: 'CASCADE',
  });

  // Users + Project
  models.ProjectModel.belongsTo(models.UserModel, {
    foreignKey: {
      name: 'owner',
      allowNull: false,
    },
    as: 'users',
    onDelete: 'CASCADE',
  });

  models.UserModel.hasMany(models.ProjectModel, {
    foreignKey: {
      name: 'owner',
      allowNull: false,
    },
    as: 'users',
    onDelete: 'CASCADE',
  });

  // Vendors + Villages
  models.VendorModel.belongsTo(models.VillageModel, {
    foreignKey: {
      name: 'villageId',
      allowNull: false,
    },
    as: 'vendor_village_details',
    onDelete: 'CASCADE',
  });

  models.VillageModel.hasMany(models.VendorModel, {
    foreignKey: {
      name: 'villageId',
      allowNull: false,
    },
    as: 'vendor_village_details',
    onDelete: 'CASCADE',
  });

  // Project + Beneficiaries (junction table)
  models.ProjectModel.belongsToMany(models.BeneficiariesModel, {
    through: models.ProjectBeneficiariesModel,
    as: 'beneficiary_details',
    foreignKey: 'projectId',
  });
  models.BeneficiariesModel.belongsToMany(models.ProjectModel, {
    through: models.ProjectBeneficiariesModel,
    as: 'beneficiary_project_details',
    foreignKey: 'beneficiaryId',
  });

  // Project + Vendors (junction table)
  models.ProjectModel.belongsToMany(models.VendorModel, {
    through: models.ProjectVendorsModel,
    as: 'vendor_details',
    foreignKey: 'projectId',
  });
  models.VendorModel.belongsToMany(models.ProjectModel, {
    through: models.ProjectVendorsModel,
    as: 'vendor_project_details',
    foreignKey: 'vendorId',
  });

  // Transaction + (Project + Vendor + Beneficiary)
  models.TransactionsModel.belongsTo(models.BeneficiariesModel, {
    foreignKey: {
      name: 'beneficiaryId',
      allowNull: false,
    },
    as: 'beneficiary_data',
    onDelete: 'CASCADE',
  });

  models.BeneficiariesModel.hasMany(models.TransactionsModel, {
    foreignKey: {
      name: 'beneficiaryId',
      allowNull: false,
    },
    as: 'beneficiary_transaction_data',
    onDelete: 'CASCADE',
  });

  //-------------------------------------------------------------------------//
  models.TransactionsModel.belongsTo(models.ProjectModel, {
    foreignKey: {
      name: 'projectId',
      allowNull: false,
    },
    as: 'project_data',
    onDelete: 'CASCADE',
  });

  models.ProjectModel.hasMany(models.TransactionsModel, {
    foreignKey: {
      name: 'projectId',
      allowNull: false,
    },
    as: 'project_data',
    onDelete: 'CASCADE',
  });

  //-------------------------------------------------------------------------//

  models.TransactionsModel.belongsTo(models.VendorModel, {
    foreignKey: {
      name: 'vendorId',
      allowNull: false,
    },
    as: 'vendor_data',
    onDelete: 'CASCADE',
  });

  models.VendorModel.hasMany(models.TransactionsModel, {
    foreignKey: {
      name: 'vendorId',
      allowNull: false,
    },
    as: 'vendor_data',
    onDelete: 'CASCADE',
  });
};

createAssociations(modelFactory);
module.exports = modelFactory;
