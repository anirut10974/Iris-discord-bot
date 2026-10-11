const config = require('../config');
const geminiChat = require('../commands/gemini-chat');
const { formatDateTime } = require('../utils/logger');

// Command handlers
const commandHandlers = {
    ping: async (interaction) => {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },

    checkstatus: async (interaction) => {
        const activities = interaction.member.presence?.activities || [];
        let activityText = 'ไม่มีกิจกรรม';

        if (activities.length > 0) {
            activityText = activities.map(a => {
                if (a.type === 0) return `เล่นเกม ${a.name}`;
                if (a.type === 1) return `กำลังสตรีม ${a.name}`;
                if (a.type === 2) return `ฟังเพลง ${a.name}`;
                if (a.type === 3) return `ดู ${a.name}`;
                return a.name;
            }).join(', ');
        }

        await interaction.reply({
            content: `ตอนนี้ ${interaction.user.username} กำลัง${activityText} อยู่ค่ะ`,
            ephemeral: true
        });
    },

    resetextrarole: async (interaction, client) => {
        if (interaction.guild.ownerId !== interaction.user.id) {
            await interaction.reply({
                content: 'ขออภัยด้วยนะคะ คำสั่งนี้ใช้ได้เฉพาะเจ้าของร้านค่ะ',
                ephemeral: true
            });
            return;
        }

        try {
            const channel = await client.channels.fetch(config.channels.extraRole);
            const message = await channel.messages.fetch(config.messages.extraRole);

            await message.react(config.emojis.genshin);
            await message.react(config.emojis.pso2);
            await message.react(config.reactions.announcement);
            await message.react(config.reactions.nsfw);

            await interaction.reply({
                content: 'รีเซต React เรียบร้อยแล้วค่ะ',
                ephemeral: true
            });
        } catch (error) {
            console.error('Reset extra role error:', error);
            await interaction.reply({
                content: 'เกิดข้อผิดพลาดในการรีเซต React',
                ephemeral: true
            });
        }
    },

    'iris-info': async (interaction) => {
        const isOwner = interaction.guild && interaction.user.id === interaction.guild.ownerId;
        const info = geminiChat.getContextInfo(interaction.user.id, isOwner);

        await interaction.reply({
            content: `**ข้อมูลการคุยกับไอริส**\n\n` +
                        `ข้อความในหน่วยความจำ: \`${info.messageCount}/20\`\n` +
                        `จำนวนข้อความทั้งหมด: \`${info.totalMessages}\`\n` +
                        `ระดับความสนิท: \`${info.levelName}\``,
            ephemeral: true
        });
    },

    'iris-clear': async (interaction) => {
        geminiChat.clearContext(interaction.user.id);
        await interaction.reply({
            content: 'ไอริสล้างประวัติการคุยของนายท่านเรียบร้อยแล้วค่ะ',
            ephemeral: true
        });
    },

    'iris-user-stats': async (interaction) => {
        if (interaction.guild.ownerId !== interaction.user.id) {
            await interaction.reply({
                content: 'ขออภัยค่ะ คำสั่งนี้ใช้ได้เฉพาะเจ้าของเซิฟเวอร์เท่านั้นค่ะ',
                ephemeral: true
            });
            return;
        }

        const stats = geminiChat.getAllStats();
        await interaction.reply({
            content: `**สถิติการใช้งานไอริสทั้งหมด**\n` +
                        `ผู้ใช้ที่มีประวัติ: \`${stats.totalUsers}\`\n` +
                        `ข้อความทั้งหมด: \`${stats.totalMessages}\`\n` +
                        `ผู้ใช้ที่ใช้งานภายใน 24 ชม.: \`${stats.activeUsers}\``,
            ephemeral: true
        });
    }
};

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        // Logging เมื่อมีผู้ใช้เรียกใช้ slash command
        const timestamp = formatDateTime();
        const username = interaction.user.username;
        const commandName = interaction.commandName;
        console.log(`[${timestamp}] ${username} ใช้คำสั่ง /${commandName}`);

        // Execute command handler
        const handler = commandHandlers[commandName];
        if (handler) {
            await handler(interaction, client);
        }
    }
};
