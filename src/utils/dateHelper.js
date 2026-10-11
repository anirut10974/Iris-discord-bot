/**
 * Generate random number for image cache busting
 * @returns {number} Random number between 100000 and 999999
 */
function generateRandomNumber() {
    return Math.floor(100000 + (Math.random() * 900000));
}

/**
 * Extract username from Twitch URL
 * @param {string} url - Twitch URL
 * @returns {string} Username
 */
function extractTwitchUsername(url) {
    return url.split('twitch.tv/').pop();
}

module.exports = {
    generateRandomNumber,
    extractTwitchUsername
};
