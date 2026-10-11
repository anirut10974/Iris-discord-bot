const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
const http = require('http');
http.createServer((req, res) => res.end('Iris Bot is Alive!')).listen(process.env.PORT || 3000);
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

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

// เปิดระบบดักจับ Error และ Debug ของ Discord
client.on('debug', (info) => console.log(`[DISCORD DEBUG]: ${info}`));
client.on('error', (error) => console.error(`[DISCORD ERROR]:`, error));

// 📌 เพิ่ม 2 บรรทัดนี้ เพื่อเช็คว่าโดน Cloudflare ของ Discord บล็อกหรือเปล่า
client.rest.on('rateLimited', (info) => console.log(`[REST LIMIT]:`, info));
client.rest.on('invalidRequestWarning', (info) => console.log(`[REST WARNING]:`, info));

console.log("กำลังส่ง Token เพื่อเชื่อมต่อกับเซิร์ฟเวอร์ Discord...");

client.login(config.bot.token)
    .then(() => {
        console.log("✅ ส่งคำสั่งล็อกอินสำเร็จ! (กำลังรอสถานะ Ready)");
    })
    .catch((error) => {
        console.error("❌ ล็อกอินล้มเหลว:", error);
    });
