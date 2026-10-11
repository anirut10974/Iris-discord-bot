const { createLogEmbed } = require('../utils/embedBuilder');
const { getLogColor, getLogDescription } = require('../utils/logger');
const config = require('../config');

/**
 * หา Role จากชื่อใน config
 * @param {Guild} guild - Discord Guild object
 * @param {string} roleName - Role name from config
 * @returns {Role|null} - Role object or null if not found
 */
function getRoleByName(guild, roleName) {
    return guild.roles.cache.find(role => role.name === roleName);
}

module.exports = {
    name: 'rolemanager',
    description: "Manage roles based on reactions",
    async execute(command, reaction, user, client) {
        const guild = reaction.message.guild;

        // หา Role ทั้งหมดที่ต้องใช้
        const roles = {
            guest: getRoleByName(guild, config.roles.guest),
            customer: getRoleByName(guild, config.roles.customer),
            genshin: getRoleByName(guild, config.roles.genshin),
            pso2NGS: getRoleByName(guild, config.roles.pso2NGS),
            followerLive: getRoleByName(guild, config.roles.followerLive),
            horny: getRoleByName(guild, config.roles.horny)
        };

        const member = guild.members.cache.get(user.id);
        let targetRole;

        // Handle Terms & Conditions agreement
        if (command.includes('T&C') && reaction.emoji.name === config.reactions.ruleAgree) {
            // Remove all roles first
            const rolesToRemove = [roles.guest, roles.customer, roles.genshin, roles.pso2NGS, roles.followerLive, roles.horny];
            for (const role of rolesToRemove) {
                if (role) await member.roles.remove(role);
            }

            // Add appropriate role
            targetRole = command.includes('AGREE') ? roles.customer : roles.guest;
            await member.roles.add(targetRole);
        } else {
            // Handle additional role selection
            const emojiRoleMap = {
                [config.reactions.genshin]: roles.genshin,
                [config.reactions.pso2]: roles.pso2NGS,
                [config.reactions.announcement]: roles.followerLive,
                [config.reactions.nsfw]: roles.horny
            };

            targetRole = emojiRoleMap[reaction.emoji.name];
            if (!targetRole) return;

            if (command === 'ROLE-ADD') {
                await member.roles.add(targetRole);
            } else if (command === 'ROLE-REMOVE') {
                await member.roles.remove(targetRole);
            }
        }

        // Log the action
        client.commands.get('logging').execute(command, targetRole.id, user, client);
    }
};
