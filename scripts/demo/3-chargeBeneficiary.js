//TODO Charge tokens to beneficairy
//TODO Process charge request with OTP

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
const {
  address: serverAddress,
  privateKey: server_pk,
} = require('../../config/privateKeys/server.json');

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
  async getServerWallet() {
    await this.getSettings();
    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    return new ethers.Wallet(server_pk, provider);
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

const requestTokenFromBeneficiary = async (beneficiary, chargeAmount) => {
  const vendorWallet = await contractLib.getVendorWallet();
  const cvaProject = await contractLib.getCvaProjectContract(vendorWallet);
  const rahatClaim = await contractLib.getClaimContract();

  const tx = await cvaProject['requestTokenFromBeneficiary(address,uint256,address)'](
    beneficiary,
    chargeAmount,
    serverAddress
  );

  const receipt = await tx.wait();
  const event = receipt.events[0];
  const decodedEventArgs = rahatClaim.interface.decodeEventLog(
    'ClaimCreated',
    event.data,
    event.topics
  );
  console.log({ decodedEventArgs });
  return decodedEventArgs.claimId.toNumber();
};

const addOtpToClaim = async (claimId, otp) => {
  const serverWallet = await contractLib.getServerWallet();
  const rahatClaim = await contractLib.getClaimContract(serverWallet);
  const otpHash = ethers.utils.id(otp);
  const expiryDate = Math.floor(Date.now() / 1000) + 86400;
  await rahatClaim.addOtpToClaim(claimId, otpHash, expiryDate);
  const finalClaimsState = await rahatClaim.claims(claimId);
  console.log({ finalClaimsState });
};

const processTokenRequest = async (beneficiary, otp) => {
  const vendorWallet = await contractLib.getVendorWallet();
  const cvaProject = await contractLib.getCvaProjectContract(vendorWallet);
  const rahatToken = await contractLib.getErc20Contract();
  await cvaProject.processTokenRequest(beneficiary, otp);
  const finalVendorBalance = await rahatToken.balanceOf(vendorWallet.address);
  console.log({ finalVendorBalance: finalVendorBalance.toNumber() });
};

//TESTS

const beneficiaries = [
  '0x7131EDcF4500521cB6B55C0658b2d83589946f44',
  '0xcc85beee78cc66c03dc6aa70080d66c85dcb308d',
];

const otp = '1234';
const run = async () => {
  console.log('requesting token from claim');
  const claimId = await requestTokenFromBeneficiary(beneficiaries[0], 1);
  console.log('settingOtp to claim');
  await addOtpToClaim(claimId, otp);
  console.log('processing token request by vendor');
  await processTokenRequest(beneficiaries[0], otp);
};

run();
