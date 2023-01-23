require("../modules/services");
const config = require("config");
const { username, password, database } = config.get("db");
const SequelizeDB = require("@rumsan/core").SequelizeDB;
SequelizeDB.init(database, username, password, config.get("db"));
const controller = require("../modules/misc/misc.controller");

//const ethers = require("ethers");

// const {
//   config,
//   scripts,
//   reportApi,
//   explorerApi,
//   explorerEsatyaUrl,
// } = require("./_cronCommon");
const cashTrackData = {
  tayaba: {
    name: "tayaba",
    label: "Tayaba ",
    isActive: false,
    budget: 10000,
    balance: 2000,
    timestamp: 0,
    txHash: "",
  },
  srso: {
    name: "srso",
    label: "SRSO",
    isActive: false,
    received: 10,
    balance: 4,
    timestamp: 0,
    txHash: "",
  },
  local_rep: {
    name: "local_rep",
    label: "Local Rep",
    isActive: false,
    received: 0,
    balance: 0,
    timestamp: 0,
    txHash: "",
  },
  village_rep: {
    name: "village_rep",
    label: "Village Rep",
    isActive: false,
    received: 0,
    disbursed: 0,
    timestamp: 0,
    txHash: "",
  },
  beneficiaries: {
    name: "beneficiaries",
    label: "Beneficiaries",
    isActive: false,
    claims: 19,
    received: 45,
    timestamp: 0,
    txHash: "",
  },
};

/* uncomment in Production moving to scripts repo */

/*
const EthExplorer = {
  getLogs: async ({ topic0, ...params }) => {
    const response = await explorerApi.get("", {
      params: {
        module: "logs",
        action: "getLogs",
        fromBlock: 0,
        toBlock: "latest",
        topic0: ethers.utils.id(topic0),
        ...params,
      },
    });
    return response.data;
  },
};

const scr = {
  async getBlockData(blockNumber) {
    const blockData = await explorerEsatyaUrl.get(`api`, {
      params: {
        module: "block",
        action: "getblockreward",
        blockno: blockNumber,
      },
    });
  },

  async getTokenTransferLogs(sender, receiver, RahatCash) {
    let logOptions = {};
    if (sender) {
      logOptions = {
        fromBlock: 0,
        topic0: "Transfer(address,address,uint256)",
        topic1: RahatCash?.interface._abiCoder.encode(["address"], [sender]),
        topic0_1_opr: "and",
      };
    } else {
      logOptions = {
        fromBlock: 0,
        topic0: "Transfer(address,address,uint256)",
        topic2: RahatCash?.interface._abiCoder.encode(["address"], [receiver]),
        topic0_2_opr: "and",
      };
    }

    const response = await EthExplorer.getLogs(logOptions);

    let logs = response?.result.filter(
      (d) => d.address.toLowerCase() === RahatCash.address.toLowerCase()
    );

    let logData = logs.map((d) => {
      const _topics = d.topics.filter((d) => d !== null);
      let log = RahatCash?.interface.parseLog({
        data: d.data,
        topics: _topics,
      });
      return {
        from: log.args.from,
        to: log.args.to,
        value: log.args.value?.toNumber(), //test
      };
    });

    return {
      value: logData.reduce((a, b) => a + b.value, 0),
      timestamp: parseInt(logs[0]?.timeStamp),
      txHash: logs[0]?.transactionHash,
    };
  },

  async getDataFromChain() {
    console.log("===> Getting Data from chain");
    const { contracts, srso } = await scripts.getSettings();

    const RahatCash = await scripts.getContract("rahat_cash");
    const Rahat = await scripts.getContract("rahat");
    //tayaba
    let tayabaHash = await scr.getTokenTransferLogs(
      ethers.constants.AddressZero,
      null,
      RahatCash
    );
    cashTrackData.tayaba.timestamp = tayabaHash.timestamp;
    cashTrackData.tayaba.txHash = tayabaHash.txHash;
    cashTrackData.tayaba.budget = (await RahatCash.totalSupply()).toNumber();
    cashTrackData.tayaba.balance = (
      await RahatCash.balanceOf(contracts.rahat_tayaba)
    ).toNumber();
    if (cashTrackData.tayaba.budget > 0) cashTrackData.tayaba.isActive = true;

    //srso
    let srsoReceived = await scr.getTokenTransferLogs(
      null,
      contracts.rahat_admin,
      RahatCash
    );
    cashTrackData.srso.received = srsoReceived.value;
    cashTrackData.srso.timestamp = srsoReceived?.timestamp;
    cashTrackData.srso.txHash = srsoReceived?.txHash;

    cashTrackData.srso.balance = (
      await RahatCash.balanceOf(contracts.rahat_admin)
    ).toNumber();
    if (cashTrackData.srso.received > 0) cashTrackData.srso.isActive = true;

    //local_rep
    let local_repReceived = await scr.getTokenTransferLogs(
      null,
      contracts.rahat,
      RahatCash
    );
    cashTrackData.local_rep.received = local_repReceived.value;
    cashTrackData.local_rep.timestamp = local_repReceived?.timestamp;
    cashTrackData.local_rep.txHash = local_repReceived?.txHash;
    cashTrackData.local_rep.balance = (
      await RahatCash.balanceOf(contracts.rahat)
    ).toNumber();
    if (cashTrackData.local_rep.received > 0)
      cashTrackData.local_rep.isActive = true;

    //village_rep

    if (cashTrackData.village_rep.received > 0)
      cashTrackData.village_rep.isActive = true;

    //beneficiaries
    const projectBalanceData = await Rahat?.projectBalance(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(config.project_id)),
      contracts["rahat_admin"]
    );

    cashTrackData.beneficiaries.claims =
      projectBalanceData?.totalBudget?.toNumber() -
      projectBalanceData?.tokenBalance?.toNumber();
    //if (cashTrackData.beneficiaries.received > 0)
    cashTrackData.beneficiaries.isActive = true;
  },

  async updateReportDB() {
    try {
      await scr.getDataFromChain();
      console.log("===> Updating Reporting DB");

      console.log(cashTrackData);

      await reportApi.post(`/misc/inventory-tracker`, cashTrackData);
    } catch (err) {
      console.log(err);
    }
  },
};

(async () => {
  await scr.updateReportDB();
})();


*/

/*Remove in prouction*/
(async () => {
  let misc = new controller();
  await misc.add("inventory-tracker", cashTrackData);
})();
