/**
 * Intimacy System - ระบบค่าความสนิทกับ AI
 * คำนวณระดับความสนิทจากจำนวนข้อความที่คุย
 */

const aiStats = require('./ai-stats');

// ระดับความสนิทและข้อความบริบทแฝง
const INTIMACY_LEVELS = {
    OWNER: {
        min: -1,
        tag: "[ระบบ: OWNER] ",
        name: "OWNER",
        thName: "เจ้าของเซิร์ฟเวอร์"
    },
    SOULMATE: {
        min: 200,
        tag: "[ระบบ: SOULMATE] ",
        name: "SOULMATE",
        thName: "เพื่อนที่ไว้ใจ"
    },
    CLOSE_FRIEND: {
        min: 100,
        tag: "[ระบบ: CLOSE_FRIEND] ",
        name: "CLOSE_FRIEND",
        thName: "เพื่อนสนิท"
    },
    FRIEND: {
        min: 50,
        tag: "[ระบบ: FRIEND] ",
        name: "FRIEND",
        thName: "เพื่อน"
    },
    ACQUAINTANCE: {
        min: 20,
        tag: "[ระบบ: ACQUAINTANCE] ",
        name: "ACQUAINTANCE",
        thName: "คุ้นหน้า"
    },
    STRANGER: {
        min: 0,
        tag: "[ระบบ: STRANGER] ",
        name: "STRANGER",
        thName: "คนแปลกหน้า"
    }
};

/**
 * คำนวณระดับความสนิทจากจำนวนข้อความ
 * @param {number} messageCount - จำนวนข้อความรวม
 * @returns {object} - ระดับความสนิท
 */
function getIntimacyLevel(messageCount) {
    if (messageCount >= INTIMACY_LEVELS.SOULMATE.min) return INTIMACY_LEVELS.SOULMATE;
    if (messageCount >= INTIMACY_LEVELS.CLOSE_FRIEND.min) return INTIMACY_LEVELS.CLOSE_FRIEND;
    if (messageCount >= INTIMACY_LEVELS.FRIEND.min) return INTIMACY_LEVELS.FRIEND;
    if (messageCount >= INTIMACY_LEVELS.ACQUAINTANCE.min) return INTIMACY_LEVELS.ACQUAINTANCE;
    return INTIMACY_LEVELS.STRANGER;
}

/**
 * สร้างบริบทแฝงสำหรับส่งไปยัง AI
 * @param {string} userId - Discord User ID
 * @param {boolean} isOwner - เป็นเจ้าของเซิร์ฟเวอร์หรือไม่
 * @returns {object} - { contextTag: string, level: object, messageCount: number, nextLevel: object }
 */
function createContextTag(userId, isOwner = false) {
    // เจ้าของเซิร์ฟเวอร์ = สนิทที่สุดเสมอ
    if (isOwner) {
        return {
            contextTag: INTIMACY_LEVELS.OWNER.tag,
            level: INTIMACY_LEVELS.OWNER,
            levelName: INTIMACY_LEVELS.OWNER.name,
            messageCount: aiStats.getTotalMessageCount(userId),
            nextLevel: null
        };
    }

    const messageCount = aiStats.getTotalMessageCount(userId);
    const level = getIntimacyLevel(messageCount);

    // หาระดับถัดไป
    const levels = [INTIMACY_LEVELS.STRANGER, INTIMACY_LEVELS.ACQUAINTANCE, INTIMACY_LEVELS.FRIEND, INTIMACY_LEVELS.CLOSE_FRIEND, INTIMACY_LEVELS.SOULMATE];
    const currentLevelIndex = levels.findIndex(l => l === level);
    const nextLevel = currentLevelIndex < levels.length - 1 ? levels[currentLevelIndex + 1] : null;

    return {
        contextTag: level.tag,
        level,
        levelName: level.name,
        messageCount,
        nextLevel: nextLevel ? {
            name: nextLevel.name,
            thName: nextLevel.thName,
            messagesNeeded: nextLevel.min - messageCount
        } : null
    };
}

/**
 * แสดงข้อความสถานะความสนิท
 */
function getIntimacyStatus(userId, isOwner = false) {
    const info = createContextTag(userId, isOwner);

    let status = `ระดับความสนิท: **${info.level.thName}**\n`;
    status += `จำนวนข้อความ: **${info.messageCount}** ครั้ง\n`;

    if (info.nextLevel) {
        status += `อีก **${info.nextLevel.messagesNeeded}** ครั้งถึงจะถึงระดับ **${info.nextLevel.thName}**`;
    } else {
        status += `คุณอยู่ในระดับสูงสุดแล้วค่ะ!`;
    }

    return status;
}

module.exports = {
    createContextTag,
    getIntimacyStatus,
    INTIMACY_LEVELS
};
