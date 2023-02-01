const env = 'local';
const {
  ben_gsheetId,
  app: { url: tayaba_apiUrl },
} = require(`../config/${env}.json`);
const SHEET_NAME = 'beneficiaries';

const ethers = require('ethers');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const googleCreds = require('../config/google.json');
const { Worker } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const beneficiaryWalletPath = path.resolve(__dirname, '../play/output/beneficiaryWallets.json');

//Generates wallets and create a json in output dir

const lib = {
  splitArrayToChunks(arrayData, chunkSize) {
    var groups = arrayData
      .map((item, index) => {
        return index % chunkSize === 0 ? arrayData.slice(index, index + chunkSize) : null;
      })
      .filter(function (item) {
        return item;
      });

    return groups;
  },

  async getBenCnicNumber() {
    const doc = new GoogleSpreadsheet(ben_gsheetId);
    await doc.useServiceAccountAuth(googleCreds);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[SHEET_NAME];
    let rows = await sheet.getRows();

    return { cnicNo: rows.map((el) => Number(el.cnicNumber)) };
  },

  getSavedWallets() {
    try {
      return JSON.parse(fs.readFileSync(beneficiaryWalletPath));
    } catch (error) {
      return [];
    }
  },

  appendToSavedWallets(wallets) {
    const savedWallets = this.getSavedWallets();
    savedWallets.push(...wallets);
    fs.writeFileSync(beneficiaryWalletPath, JSON.stringify(savedWallets));
  },

  filterCnicNosWithoutWallet(cnic) {
    let savedWallets = this.getSavedWallets();
    const savedCnicNos = savedWallets.map((el) => el.cnicNo);
    return cnic.filter((el) => !savedCnicNos.includes(el));
  },
};

const generateWalletInBulk = (cnicNos) =>
  new Promise((resolve, reject) => {
    let wallets = [];
    for (const cnicNo of cnicNos) {
      const worker = new Worker(__dirname + '/worker-wallet.js', {
        workerData: {
          cnicNo,
        },
      });
      worker.on('message', (msg) => {
        wallets.push(msg);
        if (wallets.length === cnicNos.length) {
          resolve(wallets);
        }
      });
      worker.on('error', () => {
        reject();
      });
    }
  });

const run = async () => {
  const { cnicNo } = await lib.getBenCnicNumber();
  console.log(cnicNo);

  const filteredCnicNos = lib.filterCnicNosWithoutWallet(cnicNo);
  const cnicNosGroups = lib.splitArrayToChunks(filteredCnicNos, 20);
  console.log(cnicNosGroups);

  let i = 0;
  for (let el of cnicNosGroups) {
    console.log('GENERATING WALLETS FOR:', el);
    i++;
    console.log(`PROGRESS: ${i} out of ${cnicNosGroups.length}`);
    const wallets = await generateWalletInBulk(el);
    lib.appendToSavedWallets(wallets);
  }
};

run();
