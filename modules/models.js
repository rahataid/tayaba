require("@rumsan/user").initModels();
const UserModel = require("./user/user.model");
const TagModel = require("./tag/tag.model");
const BeneficiariesModel = require("./beneficiaries/beneficiaries.model");
const ProjectModel = require("./project/project.model");
const VillageModel = require("./villages/villages.model");

let modelFactory = {
  TagModel: new TagModel().init(),
  UserModel: new UserModel().init(),
  BeneficiariesModel: new BeneficiariesModel().init(),
  ProjectModel : new ProjectModel().init(),
  VillageModel : new VillageModel().init(),
};

/**********************************************************
 * All the table associations belong here
 **********************************************************/
const createAssociations = (models) => {
  // Beneficiary+Project
  models.BeneficiariesModel.belongsTo(models.ProjectModel, {
      foreignKey: {
      name: "projectId",
      allowNull: false,
    },
    as: "projects",
    onDelete: "CASCADE",
  });

  models.ProjectModel.hasMany(models.BeneficiariesModel, {
    foreignKey: {
      name: "projectId",
      allowNull: false,
    },
    as: "projects",
    onDelete: "CASCADE",
  });

  // Beneficiary+Village
  models.BeneficiariesModel.belongsTo(models.VillageModel, {
    foreignKey: {
    name: "villageId",
    allowNull: false,
  },
  as: "villages",
  onDelete: "CASCADE",
});

  models.VillageModel.hasMany(models.BeneficiariesModel, {
  foreignKey: {
    name: "villageId",
    allowNull: false,
  },
  as: "villages",
  onDelete: "CASCADE",
});


  // Users+Project
models.ProjectModel.belongsTo(models.UserModel, {
    foreignKey: {
    name: "owner",
    allowNull: false,
  },
  as: "users",
  onDelete: "CASCADE",
});

models.UserModel.hasMany(models.ProjectModel, {
  foreignKey: {
    name: "owner",
    allowNull: false,
  },
  as: "users",
  onDelete: "CASCADE",
});

 // Vendors+Villages
 models.BeneficiariesModel.belongsTo(models.ProjectModel, {
  foreignKey: {
  name: "projectId",
  allowNull: false,
},
  as: "projects",
  onDelete: "CASCADE",
});

models.ProjectModel.hasMany(models.BeneficiariesModel, {
foreignKey: {
  name: "projectId",
  allowNull: false,
},
  as: "projects",
  onDelete: "CASCADE",
});




};

createAssociations(modelFactory);
module.exports = modelFactory;
