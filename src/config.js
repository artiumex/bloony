require('dotenv').config();

module.exports = {
    client: {
        token: process.env.DISCORD_TOKEN,
        id: process.env.DISCORD_BOTID,
        presence: 'just woke up :/',
        nickname: "Tony",
    },
    handler: {
        prefix: "Dabloon, ",
        deploy: true,
        commands: {
            prefix: false,
            slash: true,
            user: true,
            message: true,
        },
        mongodb: {
            uri: process.env.MONGO_URI,
            toggle: true,
        },
    },
    users: {
        developers: [process.env.ADMIN],
    },
    messageSettings: {
        nsfwMessage: "The current channel is not a NSFW channel.",
        developerMessage: "You are not authorized to use this command.",
        ignoredMessage: "You are not authorized to use this command.",
        cooldownMessage: "Slow down buddy!",
        notHasPermissionMessage: "You do not have the permission to use this command.",
        missingDevIDsMessage: "This is a developer only command, but unable to execute due to missing user IDs in configuration file."
    }
};
