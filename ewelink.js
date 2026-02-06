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

  console.log("FULL RESPONSE:", JSON.stringify(response.data));

  if (!response.data.devicelist || response.data.devicelist.length === 0) {
    throw new Error("No devices found");
  }

  const device = response.data.devicelist.find(
    d => d.deviceid === process.env.DEVICE_ID
  );

  if (!device) {
    throw new Error("Device not found");
  }

  return device.params.switch === "on";
}
