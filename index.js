const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();
const config = require('./src/config');
const { validateConfig } = require('./src/config/validator');

// Validate configuration
if (!validateConfig()) {
    console.error('Config validation failed. Please check your .env file.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('name' in command && 'execute' in command) {
        client.commands.set(command.name, command);
        // console.log(`Loaded command: ${command.name}`);
    }
}

const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    // console.log(`Loaded event: ${event.name}`);
}

// ดักจับ Error ร้ายแรงที่อาจทำให้ระบบล่ม (แนะนำให้คงไว้สำหรับ Production)
client.on('error', (error) => console.error(`[DISCORD ERROR]:`, error));

// เริ่มการทำงานของบอท
client.login(config.bot.token);
