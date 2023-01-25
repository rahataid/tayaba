const projectId = 1;

const env = 'local';

const {
  ben_gsheetId,
  app: { url: tayaba_apiUrl },
} = require(`../config/${env}.json`);
const SHEET_NAME = 'beneficiaries';

const ethers = require('ethers');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const googleCreds = require('../config/google.json');
const axios = require('axios');

console.log({ ben_gsheetId, tayaba_apiUrl });
let villages;
const lib = {
  async getKoboFormsData() {
    const doc = new GoogleSpreadsheet(ben_gsheetId);
    await doc.useServiceAccountAuth(googleCreds);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[SHEET_NAME];
    let rows = await sheet.getRows();
    const villageNames = Array.from(new Set(rows.map((el) => el.villageName)));
    const villageData = villageNames.map((villageName) => {
      console.log(villageName);
      const vlg = rows.find((el) => el.villageName === villageName);
      return {
        name: villageName,
        taluka: vlg.taluka,
        district: vlg.district,
      };
    });
    const {
      data: { data: currentVillages },
    } = await axios.get(`${tayaba_apiUrl}/api/v1/villages`);
    const newVillageData = villageData.filter((vd) => {
      return !currentVillages.find((el) => {
        return el.name == vd.name;
      });
    });
    console.log({ newVillageData });

    for (let village of newVillageData) {
      try {
        let { data: resData } = await axios.post(`${tayaba_apiUrl}/api/v1/villages`, village);
        console.log({ resData });
      } catch (e) {
        if (e.response) console.log('>>> ERROR:', e.response.data.message);
        else console.log(e.message);
      }
    }
    const {
      data: { data: allVillages },
    } = await axios.get(`${tayaba_apiUrl}/api/v1/villages`);
    villages = allVillages;

    for (let d of rows) {
      try {
        let data = this.sanitizeRow(d);
        let { data: resData } = await axios.post(`${tayaba_apiUrl}/api/v1/beneficiaries`, data);
      } catch (e) {
        if (e.response) console.log('>>> ERROR:', e.response.data.message);
        else console.log(e.message);
      }
    }
  },

  cleanGender(gender) {
    if (gender === 'Male') return 'M';
    if (gender === 'Female') return 'F';
    if (gender === 'Other') return 'O';
    return 'U';
  },
  cleanPhoneType(phoneType) {
    if (phoneType === 'Feature') return 'featurephone';
    if (phoneType === 'Smartphone') return 'smartphone';
    return 'dumbphone';
  },
  getVillageId(villageName) {
    return villages.find((el) => el.name === villageName).id;
  },
  sanitizeRow(d) {
    let phone = d.phone?.trim();

    return {
      name: d.name?.trim(),
      walletAddress: ethers.Wallet.createRandom().address,
      gender: this.cleanGender(d.gender),
      phone: phone,
      cnicNumber: d.cnicNumber,
      phoneOwnedBy: d.phoneOwnedBy,
      simRegisteredUnder: d.simRegisteredUnder || 'N/A',
      phoneType: this.cleanPhoneType(d.phoneType),
      phoneOwnerRelation: d.phoneOwnerRelation || 'N/A',
      unionCouncil: d.unionCouncil,
      relationship: d.relationship,
      relativeName: d.relativeName,
      hasInternetAccess: d.hasInternetAccess === 'Yes' ? true : false,
      isBanked: d.hasBankAccount === 'Yes' ? true : false,
      dailyDistanceCovered: d.dailyDistanceCovered,
      dailyWaterConsumption: d.dailyWaterConsumption,
      projectId,
      villageId: this.getVillageId(d.villageName),
    };
  },
};

lib.getKoboFormsData();
