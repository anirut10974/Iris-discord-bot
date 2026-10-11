const config = require('../config');
const aiStats = require('../utils/ai-stats');
const { getIntimacyStatus, createContextTag } = require('../utils/intimacy');

class AIContextManager {
    constructor() {
        this.contexts = new Map();
    }

    // Get user context (RAM - เก็บไว้ในหน่วยความชั่วคราว)
    getContext(userId) {
        return this.contexts.get(userId) || [];
    }

    // Set user context
    setContext(userId, history) {
        this.contexts.set(userId, history);

        // บันทึก stats ลงไฟล์ด้วย
        aiStats.incrementMessageCount(userId);
    }

    // Clear user context
    clearContext(userId) {
        this.contexts.delete(userId);
        // ไม่ลบ stats เพราะต้องการสะสมครั้งทั้งหมด
    }

    // Get context info for display
    getContextInfo(userId, isOwner = false) {
        const history = this.contexts.get(userId) || [];
        const userStats = aiStats.getUserStats(userId);
        const intimacyInfo = createContextTag(userId, isOwner);

        return {
            messageCount: history.length,           // ข้อความใน RAM (สูงสุด 20)
            totalMessages: userStats.messageCount,  // ข้อความรวมทั้งหมด (จากไฟล์)
            lastActive: userStats.lastActive,
            firstChat: userStats.firstChat,
            levelName: intimacyInfo.levelName,      // ชื่อระดับความสนิท
            intimacyStatus: getIntimacyStatus(userId, isOwner)  // สถานะความสนิทเต็มรูปแบบ
        };
    }

    // Get all stats (for admin)
    getAllStats() {
        return aiStats.getStatsObject();
    }
}

module.exports = new AIContextManager();
