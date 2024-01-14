const dayjs = require('dayjs');
const ExtendedClient = require('../class/ExtendedClient');
const { EmbedBuilder } = require("discord.js");


module.exports = {
    name: 'backlogger',
    autorun: true,
    skip: false,
    cron: '0 * * * *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        if (!client.backlogs?.length > 0) return;
        const logs = client.backlogs, size = 25;
        const styles = {
            info: { prefix: ":grey_exclamation:", title: "INFO" },
            err: { prefix: ":rotating_light:", title: "ERROR" },
            done: { prefix: ":white_check_mark:", title: "SUCCESS" },
            event: { prefix: ":tada:", title: "EVENT" },
        };
        const embeds = [];
        for (const group of Array.from({ length: Math.ceil(logs.length / size) }, (v, i) => logs.slice(i * size, i * size + size))) {
            embeds.push(new EmbedBuilder()
            // .setTitle("Event Group")
            .setFields(group.map(e => {
                const selectedStyle = styles[e.style] || { prefix: ":pensive:", title: "UNKNOWN" };
                // return 
                return {
                    name: `${selectedStyle.prefix} [${selectedStyle.title}] ${selectedStyle.prefix}`,
                    value: `\`\`\`${e.msg}\`\`\`\n\`${e.time.format('MMM D YYYY, HH:mm:ss a')}\``
                }
            })));
        }
        client.channels.cache.get(process.env.EVENT_CHANNEL).send({
            content: `Logs as of ${dayjs().format('MMM D YYYY, HH:mm:ss a')}:`,
            embeds: embeds
        });
        client.backlogs = [];
    }
}