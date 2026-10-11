const { ActivityType } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.user.setActivity(config.bot.welcomeMessage, {
            type: ActivityType.Streaming,
            url: config.bot.twitchUrl
        });
        console.log(`${client.user.tag} is Online!`);
    }
};
