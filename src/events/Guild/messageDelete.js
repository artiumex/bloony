const { ChannelType, Message, EmbedBuilder } = require("discord.js");
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
        if (author.bot || message.channel.type === ChannelType.DM) return;
        const embeds = [new EmbedBuilder().setDescription(`In Server: \`${message.guild.name}\`\nIn Channel: \`${message.channel.name}\`\nCreated Timestamp: <t:${Math.floor(message.createdTimestamp/1000)}:f>`)];
        const files = attachments.map(e => {
            return `[${e.contentType}](${e.url})`
        })
        if (attachments.size > 0) {
            embeds.push(new EmbedBuilder().setDescription(`Attachments: \n- ${files.join('\n- ')}`));
        }
        const hook = {
            content: content,
            embeds: embeds.concat(),
            username: author.username,
            avatar_url: author.displayAvatarURL(),
        };
        axios.post(process.env.HOOK, hook);
    }
}