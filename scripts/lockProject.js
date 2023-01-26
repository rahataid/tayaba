const env = 'local';
const {
  app: { url: tayaba_apiUrl },
} = require(`../config/${env}.json`);

const { privateKey: donor_pk } = require('../config/privateKeys/donor.json');
const { privateKey: admin_pk } = require('../config/privateKeys/admin.json');
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
    console.log({ contracts, networkUrl });
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

const lockProject = async () => {
  const donorWallet = await contractLib.getDonorWallet();
  const cvaProject = await contractLib.getCvaProjectContract();
  await cvaProject.connect(donorWallet).lockProject();
  const isLocked = await cvaProject.isLocked();
  console.log({ isLocked });
};

const checkBalance = async () => {
  const rahatToken = await contractLib.getErc20Contract();
  const balance = (await rahatToken.balanceOf(contracts.CVAProject)).toNumber();
  console.log({ balance });
};

const OTPServerAddress = async () => {
  const cvaProject = await contractLib.getCvaProjectContract();
  const serverAddress = await cvaProject.otpServerAddress();
  console.log({ serverAddress });
};

checkBalance();
