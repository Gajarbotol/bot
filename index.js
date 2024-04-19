const { Telebot } = require('telebot');
const axios = require('axios'); // HTTP রিকোয়েস্টের জন্য

const bot = new Telebot('6531689450:AAFNTGx4bafhOll-pS2ySRRs7eAsILA9iUw');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  let joke = '';

  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    joke = response.data.joke || 'API থেকে জোকস পাওয়া যায়নি';
  } catch (error) {
    console.error(error);
    joke = 'API ত্রুটির কারণে জোকস পাওয়া যায়নি। একটি র্যান্ডম জোকস: "এখানে আপনার র্যান্ডম জোকস লিখুন"';
  }

  bot.sendMessage(chatId, joke + '\n\n@GAJARBOTOL');
});

bot.start();
