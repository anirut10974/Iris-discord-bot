const config = require('../config');

/**
 * ตรวจสอบและดึงข้อมูล reaction ที่จำเป็ก
 * @param {MessageReaction} reaction - Discord MessageReaction object
 * @param {User} user - Discord User object
 * @returns {Promise<boolean>} - true if should proceed, false if should skip
 */
async function validateReaction(reaction, user) {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return false;
    if (!reaction.message.guild) return false;
    return true;
}

/**
 * ส่ง command ไปยัง rolemanager
 * @param {string} command - Command name
 * @param {MessageReaction} reaction - Discord MessageReaction object
 * @param {User} user - Discord User object
 * @param {Client} client - Discord Client object
 */
function executeRoleManager(command, reaction, user, client) {
    client.commands.get('rolemanager').execute(command, reaction, user, client);
}

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user, client) {
        if (!(await validateReaction(reaction, user))) return;

        if (reaction.message.id === config.messages.rule && reaction.emoji.name === config.reactions.ruleAgree) {
            executeRoleManager('T&C-DECLINE', reaction, user, client);
        } else if (reaction.message.id === config.messages.extraRole) {
            executeRoleManager('ROLE-REMOVE', reaction, user, client);
        }
    }
};
