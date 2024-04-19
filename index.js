const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const token = '6531689450:AAFNTGx4bafhOll-pS2ySRRs7eAsILA9iUw';
const bot = new TelegramBot(token, {polling: true});

// Function to handle incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    while (true) {
        const joke = await getJoke();
        bot.sendMessage(chatId, joke + "\n \nmade with @gajarbotol");
        await sleep(300000); // Wait for 1 second before sending the next joke
    }
});

// Function to fetch a joke from an API
async function getJoke() {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        const joke = response.data.setup + ' ' + response.data.punchline;
        return joke;
    } catch (error) {
        console.error('Error fetching joke:', error);
        return 'জোকস লোড করা যায়নি';
    }
}

// Function to sleep for a specified time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
