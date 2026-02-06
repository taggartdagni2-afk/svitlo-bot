const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const { getDeviceStatus } = require("./ewelink");

const token = process.env.BOT_TOKEN;
const url = process.env.RENDER_EXTERNAL_URL;

const bot = new TelegramBot(token);
const app = express();

app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.setWebHook(`${url}/bot${token}`);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Бот моніторингу світла запущено ⚡");
});

bot.onText(/\/status/, async (msg) => {
  try {
    const isOn = await getDeviceStatus();
    bot.sendMessage(
      msg.chat.id,
      isOn ? "⚡ Світло є!" : "❌ Світла немає!"
    );
  } catch (error) {
    bot.sendMessage(msg.chat.id, "Помилка перевірки світла 😢");
    console.error(error);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

