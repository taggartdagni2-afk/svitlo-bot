const TelegramBot = require("node-telegram-bot-api");
const { getDeviceStatus } = require("./ewelink");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Бот моніторингу світла запущено ⚡");
});

bot.onText(/\/status/, async (msg) => {
  try {
    const isOn = await getDeviceStatus();

    if (isOn) {
      bot.sendMessage(msg.chat.id, "⚡ Світло є!");
    } else {
      bot.sendMessage(msg.chat.id, "❌ Світла немає!");
    }
  } catch (error) {
    bot.sendMessage(msg.chat.id, "Помилка перевірки світла 😢");
    console.error(error);
  }
});
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
