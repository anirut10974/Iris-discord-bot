const config = require('../config');

/**
 * หา OnStage Role และ Member สำหรับจัดการ Role
 * @param {Presence} presence - Discord Presence object
 * @returns {object|null} - { member, onStageRole } or null
 */
function getPresenceResources(presence) {
    const member = presence.guild.members.cache.get(presence.user.id);
    const onStageRole = presence.guild.roles.cache.find(role => role.name === config.roles.onStage);

    if (!member || !onStageRole) return null;
    return { member, onStageRole };
}

module.exports = {
    name: 'presenceUpdate',
    async execute(oldPresence, newPresence, client) {
        try {
            if (!newPresence.activities) return;
            if (oldPresence === null) return;

            const isOldPresenceTwitch = oldPresence.activities.some(a => a.name === 'Twitch');
            const isNewPresenceTwitch = newPresence.activities.some(a => a.name === 'Twitch');

            // User started streaming on Twitch
            if (!isOldPresenceTwitch && isNewPresenceTwitch) {
                console.log(`Add role '${config.roles.onStage}' to [${newPresence.user.tag}]`);

                const resources = getPresenceResources(newPresence);
                if (resources) {
                    resources.member.roles.add(resources.onStageRole);
                }

                // Send notification for owner only
                if (newPresence.guild.ownerId === newPresence.user.id) {
                    const activity = newPresence.activities.find(a => a.name === 'Twitch');
                    setTimeout(() => {
                        client.commands.get('message-noti-streaming').execute(activity, newPresence.user, client);
                    }, config.streaming.notificationDelay);
                }
            }
            // User stopped streaming
            else if (isOldPresenceTwitch && !isNewPresenceTwitch) {
                console.log(`Remove role '${config.roles.onStage}' from [${newPresence.user.tag}]`);

                const resources = getPresenceResources(newPresence);
                if (resources) {
                    resources.member.roles.remove(resources.onStageRole);
                }
            }
        } catch (error) {
            console.error('Presence update error:', error.message);
        }
    }
};
