require("@rumsan/user").initModels();
const UserModel = require("./user/user.model");
const TagModel = require("./tag/tag.model");
const BeneficiariesModel = require("./beneficiaries/beneficiaries.model");
const ProjectModel = require("./project/project.model");

let modelFactory = {
  TagModel: new TagModel().init(),
  UserModel: new UserModel().init(),
  BeneficiariesModel: new BeneficiariesModel().init(),
 ProjectModel : new ProjectModel().init()
};

/**********************************************************
 * All the table associations belong here
 **********************************************************/
const createAssociations = (models) => {
  // Beneficiary+Project
  // models.BeneficiariesModel.belongsTo(models.ProjectModel, {
  //   foreignKey: "projectId",
  //   onDelete: "CASCADE",
  // });
  models.ProjectModel.hasMany(models.BeneficiariesModel, {
    foreignKey: "projectId",
    as : "projects",
    onDelete: "CASCADE",
  });

  // // NFT+Collection
  // models.NFTModel.belongsTo(models.CollectionModel, {
  //   foreignKey: {
  //     name: "collectionId",
  //     allowNull: false,
  //   },
  //   as: "collection",
  //   onDelete: "CASCADE",
  // });
  // models.CollectionModel.hasMany(models.NFTModel, {
  //   foreignKey: {
  //     name: "collectionId",
  //     allowNull: false,
  //   },
  //   as: "collection",
  //   onDelete: "CASCADE",
  // });

  // //NFT+Tag
  // models.NFTModel.belongsToMany(models.TagModel, {
  //   through: models.NftTagModel,
  //   as: "tags",
  //   foreignKey: "nftId",
  // });
  // models.TagModel.belongsToMany(models.NFTModel, {
  //   through: models.NftTagModel,
  //   as: "nfts",
  //   foreignKey: "tagId",
  // });
};

createAssociations(modelFactory);
module.exports = modelFactory;
