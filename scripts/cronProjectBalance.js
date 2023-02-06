const { ethers } = require('ethers');
const { backendApi, contractsLib, LogSource } = require('./_common');

const getProjectBalance = async () => {
  let tokenContractAbi = await contractsLib.getAbi('RahatToken');
  const tokenContract = await contractsLib.getErc20Contract();
  const _settings = await contractsLib.getSettings();
  const distributors = await backendApi.get(`/vendors`);

  const disbribitorWalletAddresses = distributors.data.data.map(
    (distributor) => distributor.walletAddress
  );

  let multicallData = [];
  for (const distributorWalletAddress of disbribitorWalletAddresses) {
    const data = contractsLib.generateMultiCallData(tokenContractAbi, 'balanceOf', [
      distributorWalletAddress,
    ]);

    multicallData.push(data);
  }

  const result = await contractsLib.multicall.call(multicallData, tokenContract);
  const iface = new ethers.utils.Interface(tokenContractAbi);
  const decodedData = result.map((data) => iface.decodeFunctionResult('balanceOf', data));

  const disbursed = decodedData.reduce((acc, log) => {
    return acc + log[0]?.toNumber();
  }, 0);

  // Get all the logs of the transfer event
  const parsedTransferLogs = await LogSource.getLogs('chain', {
    contract: tokenContract,
    eventName: 'Transfer',
  });

  // Get the total amount of tokens that were transferred to the Tayaba project
  const tayabaBudget = parsedTransferLogs.reduce((acc, log) => {
    if (log.args.to === _settings.contracts.CVAProject) {
      return acc + log.args.value?.toNumber();
    }
    return acc;
  }, 0);

  // Convert the total amount of tokens to a readable format
  const budget = ethers.utils.formatUnits(tayabaBudget, 0);

  const data = {
    disbursed,
    budget: +budget,
  };

  const updated = await backendApi.put(`/projects/1`, data);
  console.log('updated', updated);
  console.log(data);
};

getProjectBalance();
