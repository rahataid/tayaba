const { AbstractController } = require('@rumsan/core/abstract');
const { MiscModel } = require('../models');
const Path = require('path');
const fs = require('fs');

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
    saveContracts: (req) => this.saveContracts(req.payload),
  };

  async add(name, value) {
    if (name === 'inventory-tracker') {
      const update = await this.table.update(
        { value },
        {
          where: { name },
          returning: true,
          raw: true,
        }
      );
      if (update[0] === 1) {
        return update[1][0];
      }
    }
    return this.table.create({ name, value });
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
    const rawData = await fs.readFileSync(dir, 'utf8');
    const data = JSON.parse(rawData);
    return { abi: data.abi };
  }

  async saveContracts({ contract, project }) {
    let name = project.name.replace(/ /g, '');
    name = name.toUpperCase();
    const path = `/../../constants/contracts/${name}.json`;
    const dir = Path.join(__dirname + path);
    return await fs.writeFileSync(dir, contract);
  }
};
