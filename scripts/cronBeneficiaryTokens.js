const { ethers } = require('ethers');
const { backendApi, contractsLib, LogSource } = require('./_common');

const script = {
  async bulkGetBeneficiaryClaims(beneficiaries) {
    const adminWallet = await contractsLib.getAdminWallet();
    const cvaProjectContract = await contractsLib.getCvaProjectContract(adminWallet);
    const abi = await contractsLib.getAbi('CVAProject');
    const callData = [];
    for (const beneficiary of beneficiaries) {
      const data = contractsLib.generateMultiCallData(abi, 'beneficiaryClaims', [beneficiary]);

      callData.push(data);
    }
    const result = await contractsLib.multicall.call(callData, cvaProjectContract);
    const iface = new ethers.utils.Interface(abi);
    const decodedData = result.map((el) => iface.decodeFunctionResult('beneficiaryClaims', el));
    const claimsIssued = decodedData.map((el, index) => {
      return {
        beneficiary: beneficiaries[index],
        tokensClaimed: el[index] ? el[index].toNumber() : '0',
      };
    });

    return claimsIssued;
  },

  async getBeneficiaryClaimsAssigned() {
    const cvaProjectContract = await contractsLib.getCvaProjectContract();
    const parsedLogs = await LogSource.getLogs('chain', {
      contract: cvaProjectContract,
      eventName: 'ClaimAdjusted',
    });
    const claimsBeneficiaries = parsedLogs.map((el) => ({
      beneficiary: el.args.beneficiary,
      assigned: el.args.amount.toNumber(),
    }));

    const claims = claimsBeneficiaries.reduce((acc, el) => {
      if (acc[el.beneficiary]) {
        acc[el.beneficiary] += el.assigned;
      } else {
        acc[el.beneficiary] = el.assigned;
      }
      return acc;
    }, {});

    return claims;
  },

  async getBeneficiaryTokenInfo() {
    const beneficiaries = await backendApi.get(`/beneficiaries`);
    const beneficiariesWalletAddresses = beneficiaries.data.data.data.map(
      (beneficiary) => beneficiary.walletAddress
    );

    const claimsIssued = await script.bulkGetBeneficiaryClaims(beneficiariesWalletAddresses);
    const claimsAssigned = await script.getBeneficiaryClaimsAssigned();

    const tokenInfo = claimsIssued.map((el) => {
      const assigned = claimsAssigned[el.beneficiary];
      return {
        ...el,
        tokensAssigned: assigned ? assigned : 0,
        isActivated: assigned ? assigned > 0 : false,
      };
    });

    return tokenInfo;
  },

  async updateBeneficiaryTokenDB() {
    const tokenInfo = await script.getBeneficiaryTokenInfo();
    console.log('tokenInfo', tokenInfo);

    for (const token of tokenInfo) {
      try {
        const { beneficiary, tokensAssigned, tokensClaimed, isActivated } = token;
        const data = {
          tokensAssigned,
          tokensClaimed,
          isActivated,
        };
        console.log('data', data);

        const updated = await backendApi.patch(
          `/beneficiaries/wallet-address/${beneficiary}`,
          data
        );
      } catch (err) {
        console.log(err);
      }
    }
    return tokenInfo;
  },
};

(async () => {
  await script.getBeneficiaryTokenInfo();
  await script.updateBeneficiaryTokenDB();
})();
