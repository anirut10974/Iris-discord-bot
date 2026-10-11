module.exports = {
    bot: {
        token: process.env.TOKEN,
        clientId: process.env.ClientID,
        welcomeMessage: process.env.BotWelcomeMessage,
        twitchUrl: process.env.TwitchUrl
    },

    channels: {
        logging: process.env.LoggingChannelId,
        welcome: process.env.WelcomeChannelId,
        rule: process.env.RuleChannelId,
        notification: process.env.NotiChannelId,
        extraRole: process.env.ExtraRoleChannelId
    },

    messages: {
        rule: process.env.RuleMessageId,
        extraRole: process.env.ExtraRoleMessageId
    },

    emojis: {
        genshin: process.env.GenshinEmojiId,
        pso2: process.env.PSO2EmojiId
    },

    roles: {
        guest: 'Guest',
        customer: 'Customer',
        onStage: 'On Stage',
        genshin: 'Genshin',
        pso2NGS: 'PSO2:NGS',
        followerLive: 'Follower Live',
        horny: 'Horny',
        shopOwner: 'Shop Owner'
    },

    roleIds: {
        followerLive: process.env.FollowerLiveRoleId
    },

    streaming: {
        notificationDelay: 30000,
        twitchBaseUrl: 'https://www.twitch.tv',
        streamerUsername: process.env.StreamerUsername || 'streamer'
    },

    reactions: {
        ruleAgree: '🆗',
        announcement: '📣',
        nsfw: '🔞',
        genshin: 'paimon_happy',
        pso2: 'rappy_thinking'
    },

    ai: {
        geminiApiKey: process.env.GEMINI_API_KEY,
        allowedChannels: [
            process.env.AI_CHANNEL_1 || '1480620546327711885',
            process.env.AI_CHANNEL_2 || '948283709465960449'
        ]
    }
};
