require("@rumsan/user").initModels();
const UserModel = require("./user/user.model");
const TagModel = require("./tag/tag.model");
const BeneficiariesModel = require("./beneficiaries/beneficiaries.model");
const ProjectModel = require("./project/project.model");
const MiscModel = require("./misc/misc.model");

let modelFactory = {
  TagModel: new TagModel().init(),
  UserModel: new UserModel().init(),
  BeneficiariesModel: new BeneficiariesModel().init(),
  ProjectModel: new ProjectModel().init(),
  MiscModel: new MiscModel().init(),
};

/**********************************************************
 * All the table associations belong here
 **********************************************************/

module.exports = modelFactory;
