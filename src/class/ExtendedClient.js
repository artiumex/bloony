const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongoose = require("../handlers/mongoose");
const components = require("../handlers/components");
const jobs = require("../handlers/jobs");
// const chats = require('../chat/module');
const express = require('../handlers/express');

const { log, error } = require('../functions');
const logger = require("../handlers/logger");

module.exports = class extends Client {
    collection = {
        interactioncommands: new Collection(),
        prefixcommands: new Collection(),
        aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection()
        },
    };
    applicationcommandsArray = [];
    chathistory = [];
    openai = new OpenAI({
        apiKey: process.env.API_KEY,
        baseURL: process.env.BASE_URL,
    });
    nickname = config.client.nickname;
    data = {
        ignored: [],
        words: [],
        presence: config.client.presence,
    };

    constructor() {
        super({
            intents: [Object.keys(GatewayIntentBits)],
            partials: [Object.keys(Partials)],
            presence: {
                activities: [{
                    name: 'dablooncat',
                    type: 4,
                    state: config.client.presence,
                }]
            },
        });
    };

    /**
     * Sends notification to the defined admin. 
     * @param {string} msg 
     * @param {'info' | 'err' | 'done' | 'event'} style 
     */
    notify = async (msg, style) => {
        const styles = {
            info: { prefix: ":grey_exclamation:", title: "INFO" },
            err: { prefix: ":rotating_light:", title: "ERROR" },
            done: { prefix: ":white_check_mark:", title: "SUCCESS" },
            event: { prefix: ":tada:", title: "EVENT" },
        };
        const selectedStyle = styles[style] || { prefix: ":pensive:", title: "UNKNOWN" };
        this.users.cache.find(u => u.id == process.env.ADMIN).send(`${selectedStyle.prefix} [${selectedStyle.title}] ${selectedStyle.prefix}\n\`\`\`${msg}\`\`\``).catch(error);
    }
    /**
     * Logs the error and notifies the admin of said error.
     * Can be called in a "catch" function.
     * @param {error} err 
     */
    nerrify = (err) => {
        log(err, 'err');
        this.notify(`${err}`, 'err');
    }

    /**
     * Changes the NICKNAME of the bot in every server it is in.
     * @param {string} newNick - The nickname to set.
     * @param {string} reason - The reason you're changing the nickname. (Shows in the audit log)
     */
    allNicknames = async (newNick, reason) => {
        const successes = [];
        const failures = [];

        const guilds = [];
        (await this.guilds.fetch({ force: true }))
            .forEach(guild => guilds.push({ id: guild.id, name: guild.name }));

        for (const g of guilds) {
            try {
                const guildy = await this.guilds.fetch(g.id);
                await guildy.members.me.setNickname(newNick, reason);
                successes.push(`${guildy.name}: ${guildy.id}`);
            } catch {
                failures.push(`${g.name}: ${g.id}`);
            }
        }
        this.notify(`${newNick}\n\nSuceeded changing nickname in following servers:\n- ${successes.join('\n- ')}\nFailed in:\n- ${failures.join('\n- ')}`, 'info');
        
    }

    start = async () => {
        logger();
        commands(this);
        events(this);
        components(this);

        if (config.handler.mongodb.toggle) mongoose();

        await this.login(process.env.CLIENT_TOKEN || config.client.token);

        if (config.handler.deploy) await deploy(this, config);
        jobs(this);
        // chats.setup(this);
        express(this);
    };
};