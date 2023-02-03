// add beneficiary to community
// send claims to beneficiary
// lock project

const env = 'local';
const {
  app: { url: tayaba_apiUrl },
} = require(`../../config/${env}.json`);

const { privateKey: donor_pk } = require('../../config/privateKeys/donor.json');
const { privateKey: admin_pk } = require('../../config/privateKeys/admin.json');
const {
  address: vendorAddress,
  privateKey: vendor_pk,
} = require('../../config/privateKeys/vendor.json');

const ethers = require('ethers');
const axios = require('axios');
let networkUrl, contracts;
const networkGasLimit = 8000000;

const contractLib = {
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

  async getAbi(contractName) {
    const {
      data: {
        data: { abi },
      },
    } = await axios.get(`${tayaba_apiUrl}/api/v1/misc/contracts/${contractName}`);
    return abi;
  },

  async getAdminWallet() {
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    return new ethers.Wallet(admin_pk, provider);
  },
  async getDonorWallet() {
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    return new ethers.Wallet(donor_pk, provider);
  },
  async getVendorWallet() {
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    return new ethers.Wallet(vendor_pk, provider);
  },

  async getErc20Contract(wallet) {
    const abi = await this.getAbi('RahatToken');
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    if (!wallet) return new ethers.Contract(contracts.RahatToken, abi, provider);
    return new ethers.Contract(contracts.RahatToken, abi, wallet);
  },

  async getRahatDonorContract(wallet) {
    const abi = await this.getAbi('RahatDonor');
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    if (!wallet) return new ethers.Contract(contracts.RahatDonor, abi, provider);
    return new ethers.Contract(contracts.RahatDonor, abi, wallet);
  },

  async getCvaProjectContract(wallet) {
    const abi = await this.getAbi('CVAProject');
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    if (!wallet) return new ethers.Contract(contracts.CVAProject, abi, provider);
    return new ethers.Contract(contracts.CVAProject, abi, wallet);
  },

  async getCommunityContract(wallet) {
    const abi = await this.getAbi('RahatCommunity');
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    if (!wallet) return new ethers.Contract(contracts.RahatCommunity, abi, provider);
    return new ethers.Contract(contracts.RahatCommunity, abi, wallet);
  },

  async getClaimContract(wallet) {
    const abi = await this.getAbi('RahatClaim');
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    if (!wallet) return new ethers.Contract(contracts.RahatClaim, abi, provider);
    return new ethers.Contract(contracts.RahatClaim, abi, wallet);
  },

  generateMultiCallData(abi, functionName, params) {
    const iface = new ethers.utils.Interface(abi);
    return iface.encodeFunctionData(functionName, params);
  },

  multicall: {
    async send(callData, contract) {
      console.log('++++Sending Transaction++++');
      estimatedGas = await contract.estimateGas.multicall(callData);
      const gasLimit = estimatedGas.toNumber() + 10000;
      if (estimatedGas.toNumber() > networkGasLimit)
        throw new Error('Gas Usage too high! Transaction will fail');
      const tx = await contract.multicall(callData, { gasLimit });
      const receipt = await tx.wait();
      console.log({ receipt });
      if (receipt.status) console.log('++++Transaction Success++++');
      else console.log('++++Transaction Failed++++');
    },
    async call(callData, contract) {
      console.log('++++Calling Contract++++');
      return contract.callStatic.multicall(callData);
    },
  },
};

const beneficiaries = [
  '0x5D4C088d637a58E8f04774f68E14662aE652b88B',
  '0x6BD89c4528CFA25b023789c6D938c2aD59dcDA05',
  '0xad609589C90De1908119E40a5697011d933Da3B4',
  '0x1304994C5BDB5eC19F7C60651C0B7ea5AdeBB924',
  '0x80DBB152560Aa2B9fdE19D634F620f3317eB681E',
  '0x515912708d87BaD6dbA7360B410675951611a954',
  '0xBFfaE914BC2Ea268943d4235534685196F23F09a',
  '0x88Dade1c39b70216FBcfe9f2428b5Fe02F789BB2',
  '0xc018f9d36b79419033193607F9C9f8FEa5127Ed4',
  '0x3FC3a0F4287A8bFEF20feB98357272E9Fc17F4Ba',
  '0x9fd29c8DD3BB08647c552F5c3a347b6c36904D7d',
  '0xBBEB866caABDDd1d783e1961a80412b226123B64',
  '0x6697766971d7c5B0f9934e4791E9180b8C2B1c2a',
  '0xc1f022b19C861059D2dc84574D5a84416f7924e6',
  '0x4D0bF026957c950061cC3316e5D077E04cfA2D8F',
  '0xdFBa3a3b2553e82EEf0D67Db03926b6832224160',
  '0x5ff9E90A6598Bf07252E6D4fAdB569ffD3596CC5',
  '0xa4C4003119dC22A8b5D6Bd597A39807Abc8F3ad6',
  '0xFc5BC1B773B22E224D7712Ed6c688D0d1b1B5c2a',
  '0xA8Ce09AAA6472f8c984E09dEDeEb1a4B6cE88544',
  '0xf8BF68521B67301664d77B14817b821855c46D80',
  '0x6464aEDc6ef5b2D55b08Cb0468D8b5633882BA1f',
  '0x5ffc378C236d77cc1aDEEb73f6D50557aa571214',
  '0xa706A142A797bD259399A71D720056C12E603a4f',
  '0x93d7762eb268B56361364441c604ddbaB259139e',
  '0x68a16a062821fC181170b4826E138BDDA4B17813',
  '0x60Fb403550Bc1344389cd923d7271d4ECCE8ec5E',
  '0x8d04E0983916542629360a9Cc7829cF0f40C33E8',
  '0xB6B4Bc545A7C0949146De73bdF265c0165034751',
  '0x5a3B042C1607498Cee487409B382F57EDe65DC29',
  '0xeD9173c652c27043FB7e821CdEbb3853079a0C6e',
  '0x989464a7E66e8FC1ED9086406036AA25E64503e6',
  '0x7b3b115B2ba668ac57fdb90D31693B41C64dfF68',
  '0x5BCbe65A5b264ECC5BbD421A5Aa0Be825F716a62',
  '0x664B66D406e26FD7456B1bf306789888b2c88D93',
  '0xc9eb43b55b2a11E5BDEB84e865cb0Fa67B673853',
  '0xD802Df0a3FcE314c5d913EAb2F96750C1AF2bd84',
  '0x3628e44B16aADaff53F34BBE9286373cCda8FA96',
  '0x082C39229b45D0aA88d82006E0Cd96143227ECF1',
  '0x67b8A83C303A95862Ba8d9FD75bdfD5638DCc19F',
  '0x905d498bdfb009975Da519646611e9ce1A8efB45',
  '0x882689DcEFB0Eb51E41eF96Ae1048fc9e3B607B1',
  '0x4c8f89Eb90108Bc10d07b5C22AF96039558a1613',
  '0xe19DdD6ffE7649cEB9BcC4A8Edae990Ce50Bb2c0',
  '0x5E8CF1bE26d4f4E5827F2038341796Ea6A34EfD4',
  '0x8B5D7A2953774FaDb4ce117cA365950FA49B57E2',
  '0xd29dDdDc60110F9275522B31C0646f923C7e8FB6',
  '0xe67EaF1A103C65b4eb4973A8217e2fd5037aF635',
  '0x50Ea8BDda53115F7EFB08CF307E8f8445B10449f',
  '0x13e65Cb89c5CF7748B55a300812917ABB363B9cB',
];

const addBeneficiaryToCommunity = async (beneficiary) => {
  const adminWallet = await contractLib.getAdminWallet();
  const communityContract = await contractLib.getCommunityContract(adminWallet);
  await communityContract.addBeneficiary(beneficiary);
  const isBeneficiary = await communityContract.isBeneficiary(beneficiary);
  console.log({ isBeneficiary });
};

const bulkAddBeneficiariesToCommunity = async (beneficiaries) => {
  const adminWallet = await contractLib.getAdminWallet();
  const communityContract = await contractLib.getCommunityContract(adminWallet);
  const abi = await contractLib.getAbi('RahatCommunity');
  const callData = [];
  for (const beneficiary of beneficiaries) {
    const data = contractLib.generateMultiCallData(abi, 'addBeneficiary', [beneficiary]);

    callData.push(data);
  }
  await contractLib.multicall.send(callData, communityContract);
};

const assignClaimsToBeneficiary = async (beneficiary, claimAmount) => {
  const adminWallet = await contractLib.getAdminWallet();
  const cvaProject = await contractLib.getCvaProjectContract(adminWallet);
  await cvaProject.assignClaims(beneficiary, claimAmount);
  const beneficiaryClaims = await cvaProject.beneficiaryClaims(beneficiary);
  console.log({ beneficiaryClaims: beneficiaryClaims.toNumber() });
};

const bulkAssignClaimsToBeneficiaries = async (beneficiaries, tokens) => {
  const adminWallet = await contractLib.getAdminWallet();
  const cvaProjectContract = await contractLib.getCvaProjectContract(adminWallet);
  const abi = await contractLib.getAbi('CVAProject');
  const callData = [];
  for (const beneficiary of beneficiaries) {
    const data = contractLib.generateMultiCallData(abi, 'assignClaims', [beneficiary, tokens]);

    callData.push(data);
  }
  await contractLib.multicall.send(callData, cvaProjectContract);
};

const bulkGetBeneficiaryClaims = async (beneficiaries) => {
  const adminWallet = await contractLib.getAdminWallet();
  const cvaProjectContract = await contractLib.getCvaProjectContract(adminWallet);
  const abi = await contractLib.getAbi('CVAProject');
  const callData = [];
  for (const beneficiary of beneficiaries) {
    const data = contractLib.generateMultiCallData(abi, 'beneficiaryClaims', [beneficiary]);

    callData.push(data);
  }
  const result = await contractLib.multicall.call(callData, cvaProjectContract);
  const iface = new ethers.utils.Interface(abi);
  const decodedData = result.map((el) => iface.decodeFunctionResult('beneficiaryClaims', el));
  const claimsIssued = decodedData.map((el, index) => ({
    beneficiary: beneficiaries[index],
    claims: el[index] ? el[index].toNumber() : '0',
  }));

  console.log({ claimsIssued });

  return claimsIssued;
};

const lockProject = async () => {
  const donorWallet = await contractLib.getDonorWallet();
  const rahatDonor = await contractLib.getRahatDonorContract(donorWallet);
  const cvaProject = await contractLib.getCvaProjectContract();
  const isLockedInitially = await cvaProject.isLocked();
  if (isLockedInitially) {
    console.log({ isLockedInitially });
    return;
  }
  await rahatDonor.lockProject(contracts.CVAProject);
  const isLocked = await cvaProject.isLocked();
  console.log({ isLocked });
};

const unlockProject = async () => {
  const donorWallet = await contractLib.getDonorWallet();
  const rahatDonor = await contractLib.getRahatDonorContract(donorWallet);
  const cvaProject = await contractLib.getCvaProjectContract();
  const isLockedInitially = await cvaProject.isLocked();
  if (!isLockedInitially) {
    console.log({ isLockedInitially });
    return;
  }
  await rahatDonor.unlockProject(contracts.CVAProject);
  const isLocked = await cvaProject.isLocked();
  console.log({ isLocked });
};

const getBenClaimBalance = async (address) => {
  const cvaProject = await contractLib.getCvaProjectContract();
  console.log((await cvaProject.beneficiaryClaims(address)).toNumber());
};
// const run = async () => {
//   console.log('add beneficiary to community');
//   await addBeneficiaryToCommunity(beneficiaries[0]);
//   console.log('assign Claim to beneficiary');
//   await assignClaimsToBeneficiary(beneficiaries[0], 10);
// };
//run();
// assignClaimsToBeneficiary('0xE777774bC1Eb6243F5E2d0FE1F2fE11745417CfB', 500);
// getBenClaimBalance('0x96ba52b8Bb7f55c41ba9b16A43B34F304e132919');
// unlockProject();
// bulkAddBeneficiariesToCommunity(beneficiaries);
// bulkAssignClaimsToBeneficiaries(beneficiaries, 1);
bulkGetBeneficiaryClaims(beneficiaries);
