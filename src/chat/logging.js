const fs = require('fs');
const { error } = require('../functions');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const tzme = 'America/Chicago';
dayjs.extend(utc)
dayjs.extend(timezone)

const now = dayjs().tz(tzme);
const logfile = `./src/logs/${now.format('YYYY_MM_DD_HH_mm_ss_SSS')}.txt`;
fs.writeFileSync(logfile, `Log Started ${now.format('MMM D YYYY, HH:mm:ss a')} (TZ: '${tzme}')`, 'utf8');
var last_channel = '0';

module.exports = async (client, message) => {
    const { guild, channel, cleanContent, author, createdTimestamp, attachments } = message;
    const output = [];

    if (channel.id !== last_channel) {
        output.push(`\n${guild.name} #${channel.name}`);
        last_channel = channel.id;
    }
    output.push(`${author.username} (${dayjs(createdTimestamp).tz(tzme).format('MMM D YYYY, HH:mm:ss a')})`);
    if (cleanContent && cleanContent.length > 0) {
        output.push(cleanContent);
    }
    if (attachments.size > 0) {
        output.push(`[${attachments.size} attachments]`);
    }
    output.push('');

    try {
        fs.appendFileSync(logfile, output.join('\n'), 'utf8');
    } catch {
        fs.appendFileSync(logfile, output.join('\n'), 'utf8').catch(error);
    }
}