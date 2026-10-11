const config = require('../config');
const { formatDateTime } = require('../utils/logger');

module.exports = {
    name: 'guildMemberAdd',
    async execute(guildMember) {
        const timestamp = formatDateTime();
        const username = guildMember.user.username;

        try {
            // Assign Guest role to new member
            const guestRole = guildMember.guild.roles.cache.find(role => role.name === config.roles.guest);
            if (guestRole) {
                await guildMember.roles.add(guestRole);
                console.log(`[${timestamp}] เพิ่ม Role 'Guest' ให้ ${username}`);
            }

            // Send welcome message
            const welcomeChannel = guildMember.guild.channels.cache.get(config.channels.welcome);
            if (welcomeChannel) {
                await welcomeChannel.send(`ยินดีต้อนรับคุณ <@${guildMember.user.id}> เข้าสู่เซิฟเวอร์ค่ะ รบกวนไปที่ <#${config.channels.rule}> เพื่ออ่านกฎและข้อบังคับของเซิฟเวอร์ก่อนการใช้งานด้วยนะคะ`);
                console.log(`[${timestamp}] ส่งข้อความต้อนรับ ${username}`);
            }

            console.log(`[${timestamp}] ${username} เข้าร่วมเซิฟเวอร์`);
        } catch (error) {
            console.error(`[${timestamp}] Error in guildMemberAdd for ${username}:`, error.message);
        }
    }
};
