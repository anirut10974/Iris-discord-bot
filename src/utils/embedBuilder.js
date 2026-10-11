const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const { formatDateTime } = require('./logger');
const { generateRandomNumber, extractTwitchUsername } = require('./dateHelper');

function createLogEmbed(user, description, color) {
    return new EmbedBuilder()
        .setColor(color)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTitle(user.tag)
        .setDescription(description)
        .setFooter({ text: formatDateTime() });
}

function createStreamEmbed(user, activity) {
    const username = extractTwitchUsername(activity.url);
    const randomNum = generateRandomNumber();

    return new EmbedBuilder()
        .setColor('#ffffff')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setAuthor({
            name: `${user.username} is now live on Twitch!`,
            iconURL: user.displayAvatarURL({ dynamic: true }),
            url: activity.url
        })
        .setTitle(activity.details)
        .setURL(activity.url)
        .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${username}-1920x1080.jpg?r=${randomNum}`)
        .setTimestamp();
}

module.exports = {
    createLogEmbed,
    createStreamEmbed
};
