const { createStreamEmbed } = require('../utils/embedBuilder');
const config = require('../config');

module.exports = {
    name: 'message-noti-streaming',
    description: "Send a message when user starts streaming on Twitch.",
    execute(activity, user, client) {
        const embed = createStreamEmbed(user, activity);
        const streamUrl = activity.url || `${config.streaming.twitchBaseUrl}/${config.streaming.streamerUsername}`;

        client.channels.cache.get(config.channels.notification).send({
            content: `<@&${config.roleIds.followerLive}> นายท่านเริ่มไลฟ์แล้วนะคะ สามารถไปดูได้ที่ ${streamUrl} ได้เลยค่า`,
            embeds: [embed],
        });
    }
};
