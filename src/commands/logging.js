const { createLogEmbed } = require('../utils/embedBuilder');
const { getLogColor, getLogDescription } = require('../utils/logger');
const config = require('../config');

module.exports = {
    name: 'logging',
    description: "Send message to logging channel",
    execute(command, roleId, user, client) {
        const color = getLogColor(command);
        const description = getLogDescription(command, roleId);
        const embed = createLogEmbed(user, description, color);

        client.channels.cache.get(config.channels.logging).send({ embeds: [embed] });
    }
};
