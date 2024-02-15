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
        const logs = client.backlogs, size = 15;
        const styles = {
            info: { prefix: ":grey_exclamation:", title: "INFO" },
            err: { prefix: ":rotating_light:", title: "ERROR" },
            done: { prefix: ":white_check_mark:", title: "SUCCESS" },
            event: { prefix: ":tada:", title: "EVENT" },
            r_reacts: { prefix: ":grin:", title: "Reacts Count", lr: '(TITLE)' },
            r_random: { prefix: ":zany_face:", title: "Reacts Random", lr: '(TITLE)' },
            r_detect: { prefix: ":mag:", title: "Emoji Detected", lr: '(TITLE)' },
        };
        const embeds = [];
        for (const group of Array.from({ length: Math.ceil(logs.length / size) }, (v, i) => logs.slice(i * size, i * size + size))) {
            embeds.push(new EmbedBuilder()
            .setFields(group.map(e => {
                const s_style = styles[e.style] || { prefix: ":pensive:", title: "UNKNOWN" };
                return {
                    name: `${s_style.prefix} ${(s_style.lr ?? '[TITLE]').replace('TITLE',s_style.title)} ${s_style.prefix}`,
                    value: `\`\`\`${e.msg}\`\`\`\n\`${e.time.format('MMM D YYYY, HH:mm:ss a')}\``
                }
            })));
        }
        client.channels.cache.get(/**process.env.EVENT_CHANNEL**/'1206867719622758452').send({
            content: `Logs as of <t:${dayjs().unix()}:f>:`,
            embeds: embeds
        });
        client.backlogs = [];
    }
}