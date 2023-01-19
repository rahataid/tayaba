const { AbstractController } = require("@rumsan/core/abstract");
const { MiscModel } = require("../models");
const Path = require("path");
const fs = require("fs");

module.exports = class extends AbstractController {
  constructor(options = {}) {
    super(options);
    options.listeners = {};
    this.table = MiscModel;
  }

  registrations = {
    add: (req) => this.add(req.params.name, req.payload, req),
    getByName: (req) => this.getByName(req.params.name, req),
    getContracts: (req, h) => this.getContracts(req.params.contract),
  };

  async add(name, value) {
    return await this.table.create({ name, value });
  }

  async getByName(name) {
    let res = await this.table.findOne({
      where: { name },
    });
    return res.value;
  }
  async getContracts(param) {
    const path = `/../../constants/contracts/${param}.json`;
    const dir = Path.join(__dirname + path);
    const rawData = await fs.readFileSync(dir, "utf8");
    const data = JSON.parse(rawData);
    return { abi: data.abi };
  }
};
