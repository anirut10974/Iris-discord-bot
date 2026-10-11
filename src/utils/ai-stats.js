/**
 * AI Stats Manager - จัดการการบันทึก/อ่านประวัติการคุย AI ลงไฟล์
 * เมื่อ restart bot จะอ่านไฟล์แล้วนับจำนวนต่อ
 */

const fs = require('fs');
const path = require('path');

const STATS_FILE = path.join(__dirname, '../../ai-stats.json');

// โครงสร้างข้อมูล
// {
//   "userId": {
//     "messageCount": 10,
//     "lastActive": "2025-01-15T10:30:00.000Z",
//     "firstChat": "2025-01-10T08:00:00.000Z"
//   }
// }

class AIStatsManager {
    constructor() {
        this.stats = new Map();
        this.loadFromFile();
    }

    // อ่านข้อมูลจากไฟล์เมื่อเริ่ม bot
    loadFromFile() {
        try {
            if (fs.existsSync(STATS_FILE)) {
                const data = fs.readFileSync(STATS_FILE, 'utf8');
                const parsed = JSON.parse(data);

                for (const [userId, userStats] of Object.entries(parsed)) {
                    this.stats.set(userId, userStats);
                }
                // console.log(`Loaded AI stats for ${this.stats.size} users`);
            }
        } catch (error) {
            console.error('Error loading AI stats:', error.message);
        }
    }

    // บันทึกข้อมูลลงไฟล์
    saveToFile() {
        try {
            const data = Object.fromEntries(this.stats);
            fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving AI stats:', error.message);
        }
    }

    // เพิ่มจำนวนข้อความเมื่อมีการคุย
    incrementMessageCount(userId) {
        const now = new Date().toISOString();
        const userStats = this.stats.get(userId) || {
            messageCount: 0,
            lastActive: null,
            firstChat: now
        };

        userStats.messageCount++;
        userStats.lastActive = now;

        this.stats.set(userId, userStats);
        this.saveToFile();
    }

    // ดึงจำนวนข้อความรวมของ user
    getTotalMessageCount(userId) {
        const userStats = this.stats.get(userId);
        return userStats ? userStats.messageCount : 0;
    }

    // ดึงข้อมูล user ทั้งหมด
    getUserStats(userId) {
        return this.stats.get(userId) || {
            messageCount: 0,
            lastActive: null,
            firstChat: null
        };
    }

    // ดึงข้อมูลทั้งหมด (สำหรับ admin)
    getAllStats() {
        return Object.fromEntries(this.stats);
    }

    // ดึงข้อมูลเป็น object (สำหรับแสดงผล)
    getStatsObject() {
        const totalMessages = Array.from(this.stats.values()).reduce((sum, stat) => sum + stat.messageCount, 0);
        const activeUsers = Array.from(this.stats.values()).filter(stat => {
            if (!stat.lastActive) return false;
            const hoursSinceActive = (Date.now() - new Date(stat.lastActive)) / (1000 * 60 * 60);
            return hoursSinceActive < 24;
        }).length;

        return {
            totalUsers: this.stats.size,
            totalMessages,
            activeUsers
        };
    }
}

module.exports = new AIStatsManager();
