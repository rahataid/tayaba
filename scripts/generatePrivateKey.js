const { ethers } = require('ethers');

let keys = {
  privateKey: '',
  publicKey: '',
  address: '',
};
const generatePrivateKeyJSON = (fileName) => {
  const wallet = ethers.Wallet.createRandom();
  const privateKey = wallet.privateKey;
  const publicKey = wallet.publicKey;
  const address = wallet.address;

  keys.privateKey = privateKey;
  keys.publicKey = publicKey;
  keys.address = address;

  const fs = require('fs');

  const dir = './config/privateKeys';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(dir + `/${fileName}.json`, JSON.stringify(keys, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File has been created');
  });
};

generatePrivateKeyJSON('admin');
