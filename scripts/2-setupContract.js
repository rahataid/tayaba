const config = require('config');
const { username, password, database } = config.get('db');
const SequelizeDB = require('@rumsan/core').SequelizeDB;
SequelizeDB.init(database, username, password, config.get('db'));
const { db } = SequelizeDB;
const AppSettings = require('@rumsan/core').AppSettings;
require('@rumsan/core/appSettings/model')();

const deploymentData = {
  communityName: 'Tayaba',
  projectName: 'H20 Wheels',
  tokenName: 'H20Wheel',
  tokenSymbol: 'H20',
  tokenDecimals: 0,
};

const { privateKey: deployerPrivateKey } = require('../config/privateKeys/deployer.json');
const {
  address: adminAddress,
  privateKey: adminPrivateKey,
} = require('../config/privateKeys/admin.json');
const { address: serverAddress } = require('../config/privateKeys/server.json');
const {
  address: donorAddress,
  privateKey: donorPrivateKey,
} = require('../config/privateKeys/donor.json');
const ethers = require('ethers');

const network = config.get('blockchain.httpProvider');
const provider = new ethers.providers.JsonRpcProvider(network);

const lib = {
  getContractArtifacts(contract) {
    const { contractName, bytecode, abi } = require(`../constants/contracts/${contract}.json`);
    return { contractName, bytecode, abi };
  },
  async deployContract(abi, bytecode, args) {
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
};

const setupContracts = async () => {
  const { abi: RahatDonorAbi, bytecode: RahatDonorBytecode } =
    lib.getContractArtifacts('RahatDonor');
  const { abi: RahatClaimAbi, bytecode: RahatClaimBytecode } =
    lib.getContractArtifacts('RahatClaim');
  const { abi: RahatCommunityAbi, bytecode: RahatCommunityBytecode } =
    lib.getContractArtifacts('RahatCommunity');
  const { abi: CVAProjectAbi, bytecode: CVAProjectBytecode } =
    lib.getContractArtifacts('CVAProject');
  const { abi: RahatTokenAbi, bytecode: RahatTokenBytecode } =
    lib.getContractArtifacts('RahatToken');
  const adminWallet = lib.getWalletFromPrivateKey(adminPrivateKey);
  const donorWallet = lib.getWalletFromPrivateKey(donorPrivateKey);

  console.log('1/4 DEPLOYING RAHAT Donor');
  const rahatDonor = await lib.deployContract(RahatDonorAbi, RahatDonorBytecode, [donorAddress]);

  console.log('2/4 DEPLOYING RAHAT CLAIM');
  const rahatClaim = await lib.deployContract(RahatClaimAbi, RahatClaimBytecode, []);

  console.log('3/4 DEPLOYING RAHAT COMMUNITY');
  const rahatCommunity = await lib.deployContract(RahatCommunityAbi, RahatCommunityBytecode, [
    deploymentData.communityName,
    adminAddress,
  ]);

  const rahatToken = await lib.deployContract(RahatTokenAbi, RahatTokenBytecode, [
    deploymentData.tokenName,
    deploymentData.tokenSymbol,
    rahatDonor.address,
    deploymentData.tokenDecimals,
  ]);

  ///@notice create token through donor contract
  // const tx = await rahatDonor.connect(donorWallet).createToken(deploymentData.tokenName, deploymentData.tokenSymbol, deploymentData.tokenDecimals);
  // const receipt = await tx.wait();
  // const tokenCreationEvent = receipt.events.find((el) => el.event === 'TokenCreated')
  // const tokenAddress = tokenCreationEvent.args.tokenAddress

  console.log('4/4 DEPLOYING CVA Project');
  const cvaProject = await lib.deployContract(CVAProjectAbi, CVAProjectBytecode, [
    deploymentData.projectName,
    rahatToken.address,
    rahatClaim.address,
    serverAddress,
    rahatCommunity.address,
  ]);

  //Add project to Community
  console.log('Adding project to community');
  await rahatCommunity.connect(adminWallet).approveProject(cvaProject.address);
  const addresData = {
    RahatDonor: rahatDonor.address,
    RahatClaim: rahatClaim.address,
    RahatToken: rahatToken.address,
    RahatCommunity: rahatCommunity.address,
    CVAProject: cvaProject.address,
  };
  console.log({ addresData });
  console.log('Updating App Settings');
  await AppSettings.init(db);
  const d = await AppSettings.controller._add({
    name: 'Contract_Address',
    value: addresData,
    isReadOnly: true,
    isPrivate: false,
  });
  await AppSettings.controller._add({
    name: 'blockchain',
    value: {
      networkUrl: config.get('blockchain.httpProvider'),
      chainWebSocket: config.get('blockchain.webSocketProvider'),
      chainId: config.get('blockchain.chainId'),
    },
    isReadOnly: true,
    isPrivate: false,
  });
  console.log({ d });
  await AppSettings.refresh();
  process.exit(0);
};

setupContracts();
