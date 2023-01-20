const config = require("../helpers/config");

const axios = require("axios");
const ethers = require("ethers");
const api = axios.create({ baseURL: `http://localhost:${config.app.port}/api/v1` });

describe("User OTP Tests", () => {
  let vendor = ethers.Wallet.fromMnemonic(
    "file gospel entry voyage between shuffle puzzle vault fantasy excuse cover any"
  );
  beforeAll(async () => {});

  it("should create login otp", async () => {
    let {
      data: { data: signPayload },
    } = await api.get(`/auth/wallet?cid=${vendor.address}`);

    let signature = await vendor.signMessage(signPayload);
    let { data } = await api.get("/vendors/register", {
      headers: { signature, signPayload },
    });
  });
});
