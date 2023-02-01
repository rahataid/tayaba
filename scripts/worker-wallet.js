const { parentPort, workerData } = require('worker_threads');
const { BrainWallet } = require('@ethersproject/experimental');
const { ethers } = require('ethers');
const keccak256 = (txt) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(txt));

const { cnicNo } = workerData;

const generateWallet = async () => {
  var benId = keccak256(cnicNo.toString());
  var password = keccak256('9670');
  const benWallet = await BrainWallet.generate(benId, password);
  parentPort.postMessage({ cnicNo, walletAddress: benWallet.address });
};

generateWallet();
