const { GoogleGenAI } = require('@google/genai');
const config = require('../config');
const persona = require('../config/persona');
const mintData = require('../config/friend-mint');   // ดึงข้อมูลมินต์
const lemonData = require('../config/friend-lemon'); // ดึงข้อมูลเลม่อน
const aiHelper = require('./ai-helper');
const { createContextTag } = require('../utils/intimacy');

const ai = new GoogleGenAI({});

module.exports = {
    name: 'gemini-chat',
    description: "Handle AI chat interactions with Gemini",
    async execute(message, client) {
        if (message.author.bot) return;

        // Check if channel is allowed
        if (!config.ai.allowedChannels.includes(message.channel.id)) return;

        // Check if bot is mentioned or reply to bot
        const isMentioned = message.mentions.has(client.user);
        let isReplyToBot = false;

        if (message.reference) {
            try {
                const referencedMessage = await message.fetchReference();
                isReplyToBot = referencedMessage.author.id === client.user.id;
            } catch (error) {
                console.error('Error fetching reference:', error.message);
            }
        }

        if (!isMentioned && !isReplyToBot) return;

        // Prepare message (remove bot tag)
        const cleanMessage = message.content.replace(/<@!?\d+>/g, '').trim();

        // Handle reset commands
        const resetCommands = ['ลืมให้หมด', 'ล้างความจำ', 'reset'];
        if (resetCommands.some(cmd => cleanMessage.toLowerCase().includes(cmd))) {
            aiHelper.clearContext(message.author.id);
            return message.reply('รับทราบค่ะ! ไอริสล้างประวัติการคุยเรียบร้อยแล้วค่ะ');
        }

        try {
            await message.channel.sendTyping();

            // Get user history (max 20 messages)
            let history = aiHelper.getContext(message.author.id);

            // 1. เช็คว่าเป็นเจ้าของเซิร์ฟเวอร์หรือไม่
            const isOwner = message.guild && message.author.id === message.guild.ownerId;

            // 2. สร้างบริบทแฝงตามระดับความสนิท
            const { contextTag } = createContextTag(message.author.id, isOwner);

            // สร้างเวลาแบบสั้น (เช่น 16/5/2569 03:26) เพื่อประหยัด Token สูงสุด
            const currentTime = new Date().toLocaleString('th-TH', { 
                timeZone: 'Asia/Bangkok', 
                dateStyle: 'short', 
                timeStyle: 'short' 
            });

            // 3. รวมบริบทแฝงกับข้อความที่ผู้ใช้พิมพ์
            const messageToSend = contextTag + cleanMessage;

            // ---- ส่วนที่เพิ่มใหม่เพื่อจัดการประวัติเพื่อน ----
            let dynamicInstruction = persona.systemInstruction;
            
            // เช็คจากข้อความผู้ใช้ว่ามีการพูดถึงมินต์หรือเลม่อนหรือไม่
            if (cleanMessage.includes('มินต์') || cleanMessage.includes('มิ้นต์') || cleanMessage.includes('Mint')) {
                dynamicInstruction += `\n\n${mintData}`; // แนบประวัติมินต์
            }
            if (cleanMessage.includes('เลม่อน') || cleanMessage.includes('Lemon')) {
                dynamicInstruction += `\n\n${lemonData}`; // แนบประวัติเลม่อน
            }
            
            // ต่อด้วยเวลาปัจจุบันเหมือนเดิม
            dynamicInstruction += `\n\n[ระบบ: เวลาปัจจุบันคือ ${currentTime}]`;

            // Call Gemini API with correct syntax
            const response = await ai.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: [
                    ...history,
                    { role: 'user', parts: [{ text: messageToSend }] }
                ],
                config: {
                    systemInstruction: dynamicInstruction
                    // ,
                    // tools: [{ googleSearch: {} }]
                }
            });

            // Get response text
            const botReply = response.text;

            // Update chat history (บันทึกแค่ cleanMessage เพื่อประหยัด Token)
            history.push({ role: 'user', parts: [{ text: cleanMessage }] });
            history.push({ role: 'model', parts: [{ text: botReply }] });

            // Keep only last 20 messages
            if (history.length > 20) {
                history = history.slice(-20);
            }

            aiHelper.setContext(message.author.id, history);
            await message.reply(botReply);

        } catch (error) {
            console.error('Gemini Error:', error.message);

            // ดึง status จาก error message ถ้ามี
            const is503 = error.status === 503 || (error.message && error.message.includes('503'));
            const is429 = error.status === 429 || (error.message && error.message.includes('429'));

            if (is503) {
                await message.reply('ตอนนี้ไอริสรู้สึกง่วงนอนนิดหน่อยค่ะ สมองประมวลผลไม่ค่อยทันเลย ขอไอริสพักหายใจสัก 2-3 นาทีแล้วนายท่านค่อยทักมาใหม่ๆ นะคะ');
            } else if (is429) {
                // เพิ่มเงื่อนไข 429 ตรงนี้ค่ะ
                await message.reply('(หน้าซีดเล็กน้อย) ขะ...ขออภัยค่ะนายท่าน วันนี้ไอริสใช้พลังงาน (โควตา) ไปจนหมดเกลี้ยงแล้วค่ะ คงต้องขอพักฟื้นพลังก่อนนะคะ...');
            } else {
                await message.reply('ขออภัยนะคะ ดูเหมือนตอนนี้จะรู้สึกไม่ค่อยสบายนิดหน่อยค่ะ ขอตัวก่อนนะคะ (ระบบ AI ขัดข้อง)');
            }
        }
    },

    // Clear context for specific user
    clearContext(userId) {
        aiHelper.clearContext(userId);
    },

    // Get context info
    getContextInfo(userId, isOwner = false) {
        return aiHelper.getContextInfo(userId, isOwner);
    },

    // Get all stats
    getAllStats() {
        return aiHelper.getAllStats();
    }
};
