/**
 * Format current date/time for logging
 * @returns {string} Formatted date/time string
 */
function formatDateTime() {
    const dateOb = new Date();
    const date = String(dateOb.getDate()).padStart(2, '0');
    const month = String(dateOb.getMonth() + 1).padStart(2, '0');
    const year = dateOb.getFullYear();
    const hours = dateOb.getHours();
    const minutes = dateOb.getMinutes();
    const seconds = dateOb.getSeconds();
    return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
}

/**
 * Get log color based on command type
 * @param {string} command - Command name
 * @returns {string} Hex color code
 */
function getLogColor(command) {
    const colorMap = {
        'T&C-AGREE': '#52ff4f',
        'T&C-DECLINE': '#ff3030',
        'ROLE-ADD': '#52ff4f',
        'ROLE-REMOVE': '#ff3030'
    };
    return colorMap[command] || '#ffffff';
}

/**
 * Get log description based on command type
 * @param {string} command - Command name
 * @param {string} roleId - Role ID (for ROLE-ADD/REMOVE)
 * @returns {string} Description text
 */
function getLogDescription(command, roleId = '') {
    const descMap = {
        'T&C-AGREE': 'ยอมรับข้อตกลงและเพิ่ม Role พื้นฐานให้เรียบร้อยแล้ว',
        'T&C-DECLINE': 'นำ Role ทั้งหมดออกแล้ว',
        'ROLE-ADD': `ได้เพิ่ม Role <@&${roleId}> แล้ว`,
        'ROLE-REMOVE': `นำ Role <@&${roleId}> ออกแล้ว`
    };
    return descMap[command] || '';
}

module.exports = {
    formatDateTime,
    getLogColor,
    getLogDescription
};
