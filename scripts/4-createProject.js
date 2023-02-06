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

const projectData = {
  rahatTokenAddress: '',
  rahatClaimAddress: '',
  rahatCommunityAddress: '',
  name: 'H20 Wheels',
  startDate: '2023-01-24',
  endDate: '2023-01-24',
  owner: 1,
  budget: 0,
  disbursed: 0,
};

const lib = {
  async deployContract(contractName, args) {
    const { abi, bytecode } = require(`../constants/contracts/${contractName}.json`);

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

        const cvaProject = await lib.deployContract('CVAProject', [
          projectData.name,
          projectData.rahatTokenAddress,
          projectData.rahatClaimAddress,
          serverAddress,
          projectData.rahatCommunityAddress,
        ]);

        await projectController.add(projectData);
        console.log('Project Added');
        process.exit(0);
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  },

  async addProjectUsingApi() {},
};
