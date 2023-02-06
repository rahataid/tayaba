const { ethers } = require('ethers');
const { backendApi, contractsLib, LogSource } = require('./_common');

const script = {
  async bulkGetBeneficiaryClaims(beneficiaries) {
    const claimContract = await contractsLib.getClaimContract();
    const claimAbi = await contractsLib.getAbi('RahatClaim');

    const claimCount = await claimContract.claimCount();

    const callData = Array(claimCount)
      .fill(0)
      .map((el, index) => {
        const data = contractsLib.generateMultiCallData(claimAbi, 'claims', [index + 1]);

        return data;
      });

    const result = await contractsLib.multicall.call(callData, claimContract);

    const iface = new ethers.utils.Interface(claimAbi);
    const decodedData = result.map((el) => iface.decodeFunctionResult('claims', el));

    const claimsIssued = beneficiaries.map((beneficiary) => {
      const claim = decodedData.find((el) => el['claimeeAddress'] === beneficiary);
      return {
        beneficiary,
        tokensClaimed: claim ? claim['amount'].toNumber() : 0,
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

    for (const token of tokenInfo) {
      try {
        const { beneficiary, tokensAssigned, tokensClaimed, isActivated } = token;
        const data = {
          tokensAssigned,
          tokensClaimed,
          isActivated,
        };

        const updated = await backendApi.patch(
          `/beneficiaries/wallet-address/${beneficiary}`,
          data
        );
        return updated;
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
