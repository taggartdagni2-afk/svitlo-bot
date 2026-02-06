const axios = require("axios");

const EMAIL = process.env.EWELINK_EMAIL;
const PASSWORD = process.env.EWELINK_PASSWORD;
const DEVICE_ID = process.env.DEVICE_ID;

let accessToken = null;

// Логін в eWeLink
async function login() {
  const response = await axios.post(
    "https://eu-api.coolkit.cc:8080/api/user/login",
    {
      email: EMAIL,
      password: PASSWORD,
      version: "8",
      ts: Date.now()
    }
  );

  console.log("LOGIN RESPONSE:", JSON.stringify(response.data));

  if (!response.data.at) {
    throw new Error("Login failed");
  }

  accessToken = response.data.at;
}

// Отримати статус пристрою
async function getDeviceStatus() {
  if (!accessToken) {
    await login();
  }

  const response = await axios.get(
    "https://eu-api.coolkit.cc:8080/api/user/device",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  console.log("DEVICES RESPONSE:", JSON.stringify(response.data));

  if (!response.data.devicelist || response.data.devicelist.length === 0) {
    throw new Error("No devices found");
  }

  const device = response.data.devicelist.find(
    d => d.deviceid === DEVICE_ID
  );

  if (!device) {
    throw new Error("Device not found");
  }

  return device.params.switch === "on";
}

module.exports = { getDeviceStatus };

