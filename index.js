const https = require('https');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const bot = new TelegramBot('YOUR_TELEGRAM_BOT_TOKEN', { polling: true });

// ত্রুটি বিবরণ সহ চ্যাট আইডিতে একটি অবহিততা প্রেরণ করুন
const CHAT_ID = 'YOUR_CHAT_ID';

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
  বট তৈরি হয়েছে!
  ফাইল লিঙ্ক শেয়ার করুন এবং দেখুন কী হয়!
  `;
  bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const fileUrl = msg.text;

  downloadFile(fileUrl, (fileName) => {
    if (!fileName) {
      bot.sendMessage(chatId, 'দুঃখিত, ফাইলটি ডাউনলোড করা সম্ভব হয়নি। অনুগ্রহ করে একটি বৈধ ফাইল লিঙ্ক পরীক্ষা করুন।');
      return;
    }

    const fileExtension = fileName.split('.').pop();
    const caption = `ফাইলটি ডাউনলোড করা হয়েছে\n\nMADE WITH @GAJARBOTOL`;
    
    switch (fileExtension) {
      case 'apk':
        bot.sendDocument(chatId, fileName, { caption: caption });
        break;
      case 'mp4':
        bot.sendVideo(chatId, fileName, { caption: caption });
        break;
      case 'exe':
        bot.sendDocument(chatId, fileName, { caption: caption });
        break;
      case 'png':
        bot.sendPhoto(chatId, fileName, { caption: caption });
        break;
      default:
        bot.sendDocument(chatId, fileName, { caption: caption });
    }

    // ফাইল মুছে ফেলুন
    deleteFile(fileName);
  });
});

function downloadFile(url, callback) {
  const fileName = url.substring(url.lastIndexOf('/') + 1);
  const file = fs.createWriteStream(fileName);

  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      callback(null);
      logError(`ফাইল ডাউনলোড সমস্যা: HTTP কোড ${response.statusCode}`);
      return;
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close(() => callback(fileName));
    });
  }).on('error', (err) => {
    console.error('ফাইল ডাউনলোডে সমস্যা:', err.message);
    logError(`ফাইল ডাউনলোডে সমস্যা: ${err.message}`);
    callback(null);
  });
}

function deleteFile(fileName) {
  fs.unlink(fileName, (err) => {
    if (err) {
      console.error('ফাইল মুছে ফেলার সময় সমস্যা:', err.message);
      logError(`ফাইল মুছে ফেলার সময় সমস্যা: ${err.message}`);
      return;
    }
    console.log('ফাইলটি সফলভাবে মুছে ফেলা হয়েছে:', fileName);
  });
}

function logError(errorMessage) {
  bot.sendMessage(CHAT_ID, `ত্রুটি: ${errorMessage}`);
}
