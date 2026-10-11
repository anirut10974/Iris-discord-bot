/**
 * ลบ Slash Commands ทั้งหมด (Guild + Global) ทันที
 */

const { REST, Routes } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.ClientID;
const GUILD_ID = process.env.GUILD_ID;

const rest = new REST().setToken(TOKEN);

console.log('═══════════════════════════════════════════════════════');
console.log('           Delete All Slash Commands');
console.log('═══════════════════════════════════════════════════════');
console.log(`Bot ID: ${CLIENT_ID}`);
console.log(`Server ID: ${GUILD_ID}`);
console.log('═══════════════════════════════════════════════════════\n');

async function deleteAll() {
    let totalDeleted = 0;

    // 1. Delete Guild Commands
    if (GUILD_ID) {
        try {
            console.log(`Deleting Guild Commands...`);
            const result = await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: [] }
            );
            console.log(`Deleted ${result.length} Guild Commands`);
            totalDeleted += result.length;
        } catch (error) {
            console.log(`Guild Error: ${error.message}`);
        }
    }

    // 2. Delete Global Commands
    try {
        console.log(`\nDeleting Global Commands...`);
        const result = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: [] }
        );
        console.log(`Deleted ${result.length} Global Commands`);
        totalDeleted += result.length;
    } catch (error) {
        console.log(`Global Error: ${error.message}`);
    }

    console.log(`\nTotal deleted: ${totalDeleted} commands`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nNow run: npm run deploy\n');
}

deleteAll();
