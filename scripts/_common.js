const ethers = require('ethers');
const { default: axios } = require('axios');

const ENV = 'stage';

const config = require(`../config/${ENV}.json`);

const { app } = config;
let networkUrl, contracts;

const Lib = {
  async getSettings() {
    const {
      data: {
        data: {
          CONTRACT_ADDRESS: _contracts,
          BLOCKCHAIN: { networkUrl: _networkUrl },
        },
      },
    } = await axios.get(`${app.url}/api/v1/settings`);
    networkUrl = _networkUrl;
    contracts = _contracts;
    return { contracts, networkUrl };
  },

  async getAbi(contractName) {
    const {
      data: {
        data: { abi },
      },
    } = await axios.get(`${app.url}/api/v1/misc/contracts/${contractName}`);
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

const backendApi = axios.create({
  baseURL: config.app.url + '/api/v1',
});

const LogSource = {
  _getExplorerLogs: async ({ topic0, ...params }) => {
    const response = await explorerApi.get('', {
      params: {
        module: 'logs',
        action: 'getLogs',
        fromBlock: 0,
        toBlock: 'latest',
        topic0: ethers.utils.id(topic0),
        ...params,
      },
    });
    return response.data;
  },

  _getContractLogs: async ({ contract, eventName, ...params }) => {
    try {
      const filterTokenReceived = contract.filters[eventName]();
      filterTokenReceived.fromBlock = 0;
      filterTokenReceived.toBlock = 'latest';

      const logs = await contract.provider.getLogs(filterTokenReceived);

      // const iface = new ethers.utils.Interface(contract.interface.abi);

      let parsedLogs = logs.map(async (log) => {
        const parsedLog = contract.interface.parseLog(log);
        const block = await contract.provider.getBlock(log.blockNumber);
        return {
          ...parsedLog,
          timestamp: block.timestamp,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };
      });

      parsedLogs = await Promise.all(parsedLogs);

      return parsedLogs;
    } catch (error) {
      console.log('error', error);
    }
  },

  getLogs: async (sourceType, { contract, eventName, ...params }) => {
    // The sourceType is one of the values defined in the LogSource enum
    switch (sourceType) {
      // If the sourceType is 'explorer' then the LogSource._getExplorerLogs function is called
      case 'explorer':
        return LogSource._getExplorerLogs({ topic0, ...params });
      // If the sourceType is 'contract' then the LogSource._getContractLogs function is called
      case 'chain':
        return LogSource._getContractLogs({ contract, eventName, ...params });
      // If the sourceType is not 'explorer' or 'contract' then the function throws an error
      default:
        throw new Error('Invalid log source type');
    }
  },
};

module.exports = {
  backendApi,
  contractsLib: Lib,
  LogSource,
};
