const { ethers } = require('ethers');
const { backendApi, contractsLib, LogSource } = require('./_common');

let contracts;

let inventoryTrackData = {
  tayaba: {
    name: 'tayaba',
    label: 'Tayaba',
    isActive: false,
    budget: 0,
    balance: 0,
    timestamp: 0,
    txHash: '',
  },
  srso: {
    name: 'srso',
    label: 'SRSO',
    isActive: false,
    received: 0,
    balance: 0,
    timestamp: 0,
    txHash: '',
  },

  village_rep: {
    name: 'village_rep',
    label: 'Distributors',
    isActive: false,
    allowance: 0,
    disbursed: 0,
    timestamp: 0,
    txHash: '',
  },
  beneficiaries: {
    name: 'beneficiaries',
    label: 'Beneficiaries',
    isActive: false,
    claims: 0,
    received: 0,
    timestamp: 0,
    txHash: '',
  },
};

const getTayabaBalance = async () => {
  // Get the ERC20 token contract instance
  const tokenContract = await contractsLib.getErc20Contract();
  // Get the current settings
  const _settings = await contractsLib.getSettings();
  // Get the list of contracts
  contracts = _settings.contracts;

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
  // Get the current balance of the Tayaba project
  const tayabaBalance = (await tokenContract.balanceOf(_settings.contracts.RahatDonor))?.toNumber();

  const latestTransactionHash = parsedTransferLogs[0]?.transactionHash;

  // Save the data to the inventory track object
  inventoryTrackData.tayaba.budget = budget;
  inventoryTrackData.tayaba.balance = tayabaBalance;
  inventoryTrackData.tayaba.timestamp = parsedTransferLogs[0]?.timestamp;
  inventoryTrackData.tayaba.txHash = latestTransactionHash;

  if (tayabaBudget > 0) {
    inventoryTrackData.tayaba.isActive = true;
  }

  return {
    budget,
    tayabaBalance,
  };
};

// This function gets the balance of the SRSO (CVAProject) by getting the project budget from the Tayaba smart contract, and the SRSO balance from the CVAToken smart contract.

const getSrsoBalance = async () => {
  // Get the budget from the Tayaba contract
  const { budget: projectBudget } = await getTayabaBalance();
  const tokenContract = await contractsLib.getErc20Contract();
  // Get the balance from the CVAProject contract
  const srsoBalance = (await tokenContract.balanceOf(contracts.CVAProject))?.toNumber() || 0;

  const { allowance: distributorAllowance } = await getDistributorBalance();

  let remainingSrsoBalance = srsoBalance - distributorAllowance;

  // Update the inventory track data
  inventoryTrackData.srso.received = projectBudget;
  inventoryTrackData.srso.balance = remainingSrsoBalance;

  if (projectBudget > 0) {
    inventoryTrackData.srso.isActive = true;
  }
};

const getDistributorBalance = async () => {
  const cvaProject = await contractsLib.getCvaProjectContract();
  const tokenContract = await contractsLib.getErc20Contract();

  let tokenContractAbi = await contractsLib.getAbi('RahatToken');

  const parsedTransferLogs = await LogSource.getLogs('chain', {
    contract: cvaProject,
    eventName: 'VendorAllowanceAccept',
  });

  const allowance = parsedTransferLogs.reduce((acc, log) => {
    return acc + log.args.amount?.toNumber();
  }, 0);

  // TODO:get vendors by project
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

  inventoryTrackData.village_rep.timestamp = parsedTransferLogs[0]?.timestamp;
  inventoryTrackData.village_rep.txHash = parsedTransferLogs[0]?.transactionHash;
  inventoryTrackData.village_rep.allowance = allowance;
  inventoryTrackData.village_rep.disbursed = disbursed;

  if (allowance > 0) {
    inventoryTrackData.village_rep.isActive = true;
  }

  return {
    allowance,
    disbursed,
  };
};

const getBeneficiaryBalance = async () => {
  const beneficiaries = await backendApi.get(`/beneficiaries`);
  const beneficiariesWalletAddresses = beneficiaries.data.data.data.map(
    (beneficiary) => beneficiary.walletAddress
  );

  const cvaProjectContract = await contractsLib.getCvaProjectContract();
  let cvaProjectContractAbi = await contractsLib.getAbi('CVAProject');

  let multicallData = [];
  for (const beneficiaryWalletAddress of beneficiariesWalletAddresses) {
    const data = contractsLib.generateMultiCallData(cvaProjectContractAbi, 'beneficiaryClaims', [
      beneficiaryWalletAddress,
    ]);

    multicallData.push(data);
  }

  const result = await contractsLib.multicall.call(multicallData, cvaProjectContract);

  const iface = new ethers.utils.Interface(cvaProjectContractAbi);
  const decodedData = result.map((data) => iface.decodeFunctionResult('beneficiaryClaims', data));

  const totalBeneficiaryBalance = decodedData.reduce((acc, log) => {
    return acc + log[0]?.toNumber();
  }, 0);

  const { disbursed } = await getDistributorBalance();

  inventoryTrackData.beneficiaries.claims = totalBeneficiaryBalance;
  inventoryTrackData.beneficiaries.received = disbursed;

  if (disbursed > 0) {
    inventoryTrackData.beneficiaries.isActive = true;
  }

  return {
    totalBeneficiaryBalance,
  };
};

const getBalance = async () => {
  await getTayabaBalance();
  await getSrsoBalance();
  await getBeneficiaryBalance();
};

const updateReportDB = async () => {
  try {
    // await scr.getDataFromChain();
    console.log('===> Updating Reporting DB');

    const updated = await backendApi.post(`/misc/inventory-tracker`, inventoryTrackData);
    if (updated.data.success) {
      console.log('updated', updated.data);
    }

    return updated;
  } catch (err) {
    console.log(err);
  }
};
(async () => {
  await getBalance();
  await updateReportDB();
})();
