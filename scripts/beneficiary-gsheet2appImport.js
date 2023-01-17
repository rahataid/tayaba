//Author: Santosh
//Import Ben data from Gsheet to App (must check isFinal box in gsheet)
const projectId = 1;

const env = "dev";

const { ben_gsheetId, tayaba_apiUrl } = require(`../config/${env}.json`);
const SHEET_NAME = "beneficiaries";

const ethers = require("ethers");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const googleCreds = require("../config/google.json");
let axios = require("axios");

let access_token =  "";

const lib = {
  async getKoboFormsData() {
    const doc = new GoogleSpreadsheet(ben_gsheetId);
    await doc.useServiceAccountAuth(googleCreds);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[SHEET_NAME];
    let rows = await sheet.getRows();

    for (let d of rows) {
      try {
        let data = this.sanitizeRow(d);

        let { data: resData } = await axios.post(
          `${tayaba_apiUrl}/beneficiaries`,
          data,
          {
            headers: {
              access_token,
            },
          }
        );

        console.log({ resData });
      } catch (e) {
        if (e.response) console.log(">>> ERROR:", e.response.data.message);
        else console.log(e.message);
      }
    }
  },

  cleanGender(gender) {
    if (gender === "Male") return "M";
    if (gender === "Female") return "F";
    if (gender === "Other") return "O";
    return "U";
  },
  cleanPhoneType(phoneType) {
    if (phoneType === "Feature") return "featurephone";
    if (phoneType === "Smartphone") return "smartphone";
    return "dumbphone";
  },
  sanitizeRow(d) {
    let phone = d.phone?.trim();

    return {
      name: d.name?.trim(),
      walletAddress: ethers.Wallet.createRandom().address,
      gender: this.cleanGender(d.gender),
      phone: phone,
      cnicNumber: d.cnicNumber,
      address: {
        taluka: d.taluka,
        district: d.district,
        village: d.villageName,
      },
      phoneOwnedBy: d.phoneOwnedBy,
      simRegisteredUnder: d.simRegisteredUnder || "N/A",
      phoneType: this.cleanPhoneType(d.phoneType),
      phoneOwnerRelation: d.phoneOwnerRelation || "N/A",
      unionCouncil: d.unionCouncil,
      relationship: d.relationship,
      relativeName: d.relativeName,
      hasInternetAccess: d.hasInternetAccess === "Yes" ? true : false,
      isBanked: d.hasBankAccount === "Yes" ? true : false,
      dailyDistanceCovered: d.dailyDistanceCovered,
      dailyWaterConsumption: d.dailyWaterConsumption,
      projectId,
    };
  },
};

lib.getKoboFormsData();