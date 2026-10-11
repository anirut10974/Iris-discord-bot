/**
 * Deploy Slash Commands (เพิ่ม commands ใหม่ 6 ตัว)
 *
 * การใช้งาน:
 * npm run deploy
 * หรือ
 * node deploy-commands.js
 */

const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commandsData = [
    {
        name: 'ping',
        description: 'ทดสอบการตอบสนองของบอท'
    },
    {
        name: 'checkstatus',
        description: 'ตรวจสอบสถานะปัจจุบันของคุณ'
    },
    {
        name: 'resetextrarole',
        description: 'รีเซต Reaction สำหรับเลือกบทบาทเพิ่มเติม (เฉพาะเจ้าของเซิร์ฟเวอร์)'
    },
    {
        name: 'iris-info',
        description: 'ดูข้อมูลการคุยกับไอริสของคุณ'
    },
    {
        name: 'iris-clear',
        description: 'ล้างประวัติการคุยกับไอริส'
    },
    {
        name: 'iris-user-stats',
        description: 'ดูสถิติการใช้งานไอริสทั้งหมด (เฉพาะเจ้าของเซิร์ฟเวอร์)'
    }
];

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('═══════════════════════════════════════════════════════');
        console.log('              Deploy Slash Commands');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`Bot ID: ${process.env.ClientID}`);
        console.log(`Server ID: ${process.env.GUILD_ID}`);
        console.log(`Commands: ${commandsData.length} คำสั่ง`);
        console.log('═══════════════════════════════════════════════════════\n');

        console.log('Deploying commands...');

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.ClientID, process.env.GUILD_ID),
            { body: commandsData }
        );

        console.log(`\nDeploy สำเร็จ!`);
        console.log(`Commands ที่ลงทะเบียน:`);
        data.forEach(cmd => {
            console.log(`   - /${cmd.name}`);
        });

        console.log('\n═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('\nเกิดข้อผิดพลาด:', error.message);
        console.log('\nลองรัน npm run clear-all ก่อน ถ้ามี commands เก่า\n');
    }
})();
