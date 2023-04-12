const env = 'local';
const {
  app: { url: tayaba_apiUrl },
} = require(`../config/${env}.json`);
// node ./play/setup.js
require('../modules/services');

const ethers = require('ethers');
const config = require('config');

const { username, password, database } = config.get('db');
const SequelizeDB = require('@rumsan/core').SequelizeDB;
SequelizeDB.init(database, username, password, config.get('db'));
const { db } = SequelizeDB;

const ProjectController = require('../modules/project/project.controller');
const projectController = new ProjectController();

const { address: serverAddress } = require('../config/privateKeys/server.json');
const { privateKey: deployerPrivateKey } = require('../config/privateKeys/deployer.json');
const { default: axios } = require('axios');

let networkUrl, contracts;

let projectData = {
  name: 'H20 Wheels',
  startDate: '2023-01-24',
  endDate: '2023-01-26',
  owner: 1,
  budget: 0,
  disbursed: 0,
  contractAddress: '',
};

const lib = {
  async getSettings() {
    const {
      data: {
        data: {
          CONTRACT_ADDRESS: _contracts,
          BLOCKCHAIN: { networkUrl: _networkUrl },
        },
      },
    } = await axios.get(`${tayaba_apiUrl}/api/v1/settings`);
    networkUrl = _networkUrl;
    contracts = _contracts;

    return { contracts, networkUrl };
  },

  async deployContract(contractName, args) {
    await this.getSettings();

    console.log('args', args);

    const { abi, bytecode } = require(`../constants/contracts/${contractName}.json`);

    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    const signer = new ethers.Wallet(deployerPrivateKey, provider);
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    contract.deployTransaction.wait();
    return new ethers.Contract(contract.address, abi, provider);
  },

  getWalletFromPrivateKey(privateKey) {
    return new ethers.Wallet(privateKey, provider);
  },

  getContract(contractAbi, contractAddress) {
    return new ethers.Contract(contractAddress, contractAbi, provider);
  },

  //---------------------------------------------------------

  async addProjectUsingController() {
    db.authenticate()
      .then(async () => {
        console.log('DEPLOYING CVA Project');

        await this.getSettings();

        const cvaProject = await lib.deployContract('CVAProject', [
          projectData.name,
          contracts.RahatToken,
          contracts.RahatClaim,
          serverAddress,
          contracts.RahatCommunity,
        ]);

        projectData.contractAddress = cvaProject.address;

        await projectController.add(projectData);
        console.log('Project Added');
        process.exit(0);
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  },
};

lib.addProjectUsingController();
