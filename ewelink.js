const axios = require("axios");

const EMAIL = process.env.EWELINK_EMAIL;
const PASSWORD = process.env.EWELINK_PASSWORD;

let accessToken = null;
let deviceId = null;

// Авторизація в eWeLink
async function login() {
  const response = await axios.post("https://eu-api.coolkit.cc:8080/api/user/login", {
    email: EMAIL,
    password: PASSWORD,
    version: "8",
    ts: Date.now()
  });

  accessToken = response.data.at;
  return accessToken;
}

// Отримати статус розетки
async function getDeviceStatus() {
  if (!accessToken) {
    await login();
  }

  const devices = await axios.get("https://eu-api.coolkit.cc:8080/api/user/device", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!deviceId) {
    deviceId = devices.data.devicelist[0].deviceid; // перша розетка
  }

  const device = devices.data.devicelist.find(d => d.deviceid === deviceId);

  return device.params.switch === "on";
}

module.exports = { getDeviceStatus };
