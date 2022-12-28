const { AuthModel } = require("@rumsan/user");
const { DataTypes } = require("sequelize");

module.exports = class extends AuthModel {
  constructor() {
    super();
    this.addSchema({});
  }
};
