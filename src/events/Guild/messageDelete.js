const { ChannelType, Message, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

const fs = require('fs');
const dayjs = require('dayjs');
const axios = require('axios');

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
        const embeds = [
            new EmbedBuilder()
                .setDescription(`In Server: \`${message.guild.name}\`\nIn Channel: \`${message.channel.name}\`\nCreated Timestamp: <t:${Math.floor(message.createdTimestamp/1000)}:f>`)
        ];
        
        if (attachments.size > 0) {
            var files = [], ind = 0;
            for (const a of attachments.map(e => { return { ct: e.contentType, name: e.name, url: e.url } })) {
                ind++;
                const loc = `images/${dayjs().format('YYYY_MM_DD_HH_mm_ss_SSS')}_${ind}.${a.name.split('.').slice(-1)}`;
                const response = await axios.get(a.url, { responseType: 'arraybuffer' });
                fs.writeFileSync('./src/public/' + loc, response.data);
                files.push(`[${a.ct} - ${a.name}](${process.env.WEBSITE + loc})`);
            }
            embeds.push(new EmbedBuilder().setDescription(`Attachments: \n- ${files.join('\n- ')}`));
        }

        client.sendHook({
            content: content,
            embeds: embeds,
            username: author.username,
            avatar_url: author.displayAvatarURL(),
        });
    }
}