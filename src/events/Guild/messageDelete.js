const { Message } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");
const axios = require("axios");

module.exports = {
    event: "messageDelete",
    /**
     *
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @returns
     */
    run: async (client, message) => {
        const { author, content, attachments } = message;
        const hook = {
            content: content,
            embeds: attachments.map(e => {
                return { image: { url: e.url } }
            }),
            username: author.username,
            avatar_url: author.displayAvatarURL(),
        };
        axios.post(process.env.HOOK,hook);
    }
}