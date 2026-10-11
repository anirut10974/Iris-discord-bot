const config = require('./index');

/**
 * ตรวจสอบ bot settings ที่จำเป็น
 */
function validateBotSettings() {
    const errors = [];
    const warnings = [];

    if (!config.bot.token) errors.push('TOKEN is required in .env');
    if (!config.bot.clientId) warnings.push('ClientID is missing - deploy-commands may not work');

    return { errors, warnings };
}

/**
 * ตรวจสอบ channel IDs ที่จำเป็น
 */
function validateChannels() {
    const warnings = [];
    const requiredChannels = {
        'LoggingChannelId': config.channels.logging,
        'WelcomeChannelId': config.channels.welcome,
        'RuleChannelId': config.channels.rule,
        'NotiChannelId': config.channels.notification,
        'ExtraRoleChannelId': config.channels.extraRole
    };

    for (const [name, value] of Object.entries(requiredChannels)) {
        if (!value) warnings.push(`${name} is missing - some features may not work`);
    }

    return warnings;
}

/**
 * ตรวจสอบ message IDs ที่จำเป็น
 */
function validateMessages() {
    const warnings = [];

    if (!config.messages.rule) warnings.push('RuleMessageId is missing - role reaction may not work');
    if (!config.messages.extraRole) warnings.push('ExtraRoleMessageId is missing - extra role reaction may not work');

    return warnings;
}

/**
 * ตรวจสอบ AI configuration
 */
function validateAI() {
    const warnings = [];

    if (!config.ai.geminiApiKey) warnings.push('GEMINI_API_KEY is missing - AI chat feature will not work');
    if (!config.roleIds.followerLive) warnings.push('FollowerLiveRoleId is missing - stream notification may not work');

    return warnings;
}

/**
 * พิมพ์ผลการตรวจสอบ
 */
function printResults(errors, warnings) {
    if (errors.length > 0) {
        console.error('Config Errors:');
        errors.forEach(err => console.error(`   - ${err}`));
    }

    if (warnings.length > 0) {
        console.warn('Config Warnings:');
        warnings.forEach(warn => console.warn(`   - ${warn}`));
    }

    if (errors.length === 0 && warnings.length === 0) {
        console.log('Config validated successfully');
    }
}

/**
 * ตรวจสอบ config ทั้งหมด
 * @returns {boolean} - true ถ้าไม่มี error
 */
function validateConfig() {
    const errors = [];
    const warnings = [];

    // Validate each section
    const botResults = validateBotSettings();
    errors.push(...botResults.errors);
    warnings.push(...botResults.warnings);

    warnings.push(...validateChannels());
    warnings.push(...validateMessages());
    warnings.push(...validateAI());

    // Print results
    printResults(errors, warnings);

    return errors.length === 0;
}

module.exports = { validateConfig };
