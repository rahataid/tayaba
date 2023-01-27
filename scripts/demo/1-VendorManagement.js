//TODO add vendor
//TODO add tokenAllowance
//TODO accept tokenAllowance

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

const addVendor = async (vendor) => {
  const adminWallet = await contractLib.getAdminWallet();
  const communityContract = await contractLib.getCommunityContract(adminWallet);
  //console.log({ adminWallet, communityContract });
  const vendorRole = await communityContract.VENDOR_ROLE();
  console.log({ vendorRole });
  await communityContract.grantRole(vendorRole, vendor);
  const gotVendorRole = await communityContract.hasRole(vendorRole, vendor);
  console.log({ gotVendorRole });
};

const sendAllowanceToVendor = async (vendor) => {
  const adminWallet = await contractLib.getAdminWallet();
  const cvaProject = await contractLib.getCvaProjectContract(adminWallet);
  await cvaProject.createAllowanceToVendor(vendor, vendorAllowanceAmount);
  const pendingAllowance = await cvaProject.vendorAllowancePending(vendor);
  console.log(pendingAllowance.toNumber());
};

const acceptAllowance = async (vendor) => {
  const vendorWallet = await contractLib.getVendorWallet();
  const cvaProject = await contractLib.getCvaProjectContract(vendorWallet);
  await cvaProject.acceptAllowanceByVendor(vendorAllowanceAmount);
  const pendingAllowance = await cvaProject.vendorAllowance(vendor);
  console.log(pendingAllowance.toNumber());
};

const vendorAllowanceAmount = 10;

const run = async () => {
  console.log('adding Vendor');
  await addVendor(vendorAddress);
  console.log('sending allowance to vendor');
  await sendAllowanceToVendor(vendorAddress);
  console.log('accept allowance');
  await acceptAllowance(vendorAddress);
};
run();
//addVendor();
//sendAllowanceToVendor(vendorAddress);
//acceptAllowance(vendorAddress);
