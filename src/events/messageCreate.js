const config = require('../config');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        // Handle AI chat (check if bot is mentioned or reply to bot)
        client.commands.get('gemini-chat').execute(message, client);
    }
};
