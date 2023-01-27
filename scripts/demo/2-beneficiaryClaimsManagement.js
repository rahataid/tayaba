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

  //   multicall: {
  //     async send(callData) {
  //       const wallet = await contractLib.getAdminWallet();
  //       const rahatRegistryContract = await contractLib.getRahatRegistryContract(wallet);
  //       console.log('++++Sending Transaction++++');
  //       estimatedGas = await rahatRegistryContract.estimateGas.multicall(callData);
  //       const gasLimit = estimatedGas.toNumber() + 10000;
  //       if (estimatedGas.toNumber() > networkGasLimit)
  //         throw new Error('Gas Usage too high! Transaction will fail');
  //       const tx = await rahatRegistryContract.multicall(callData, { gasLimit });
  //       const receipt = await tx.wait();
  //       console.log({ receipt });
  //       if (receipt.status) console.log('++++Transaction Success++++');
  //       else console.log('++++Transaction Failed++++');
  //     },
  //     async call(callData) {
  //       const rahatRegistryContract = await contractLib.getRahatRegistryContract();
  //       console.log('++++Calling Contract++++');
  //       return rahatRegistryContract.callStatic.multicall(callData);
  //     },
  //   },
};

const beneficiaries = [
  '0x7131EDcF4500521cB6B55C0658b2d83589946f44',
  '0xcc85beee78cc66c03dc6aa70080d66c85dcb308d',
];

const addBeneficiaryToCommunity = async (beneficiary) => {
  const adminWallet = await contractLib.getAdminWallet();
  const communityContract = await contractLib.getCommunityContract(adminWallet);
  await communityContract.addBeneficiary(beneficiary);
  const isBeneficiary = await communityContract.isBeneficiary(beneficiary);
  console.log({ isBeneficiary });
};

const assignClaimsToBeneficiary = async (beneficiary, claimAmount) => {
  const adminWallet = await contractLib.getAdminWallet();
  const cvaProject = await contractLib.getCvaProjectContract(adminWallet);
  await cvaProject.assignClaims(beneficiary, claimAmount);
  const beneficiaryClaims = await cvaProject.beneficiaryClaims(beneficiary);
  console.log({ beneficiaryClaims: beneficiaryClaims.toNumber() });
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

const run = async () => {
  console.log('add beneficiary to community');
  await addBeneficiaryToCommunity(beneficiaries[0]);
  console.log('assign Claim to beneficiary');
  await assignClaimsToBeneficiary(beneficiaries[0], 10);
};
//run();
//lockProject();
//unlockProject();
