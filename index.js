const Telegraf = require('telegraf');
const axios = require('axios');
const fs = require('fs');

const bot = new Telegraf('6991433735:AAHODToXJ6igTUpMkPlWjJKgIRaPne9gc7Y');

bot.start((ctx) => ctx.reply('আমি ফাইল ডাউনলোড করতে পারি। ফাইলের লিংক পাঠান।'));

bot.on('text', async (ctx) => {
    const url = ctx.message.text;

    // Check if the URL is valid
    if (!isValidURL(url)) {
        return ctx.reply('দুঃখিত, এটি একটি বৈধ URL নয়।');
    }

    // Download the file
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const fileName = getFileNameFromURL(url);
        const filePath = `downloads/${fileName}`;

        // Create a writable stream and pipe the response data to it
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            ctx.replyWithDocument({ source: fs.createReadStream(filePath) });
            ctx.reply('ফাইলটি সফলভাবে পাঠানো হয়েছে।');
        });

        writer.on('error', (err) => {
            console.error('ফাইল ডাউনলোড করার সময় ত্রুটি:', err);
            ctx.reply('ফাইল ডাউনলোড করার সময় ত্রুটি হয়েছে।');
        });
    } catch (error) {
        console.error('ফাইল ডাউনলোড করার সময় ত্রুটি:', error);
        ctx.reply('ফাইল ডাউনলোড করার সময় ত্রুটি হয়েছে।');
    }
});

// Helper function to check if a URL is valid
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Helper function to get the file name from a URL
function getFileNameFromURL(url) {
    return url.split('/').pop();
}

bot.launch();
