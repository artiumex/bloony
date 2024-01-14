const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongoose = require("../handlers/mongoose");
const components = require("../handlers/components");
const jobs = require("../handlers/jobs");
const chats = require('../chat/module');
const express = require('../handlers/express');

const { log, error } = require('../functions');
const backlogjob = require('../jobs/backlogger');
const dayjs = require("dayjs");
const axios = require("axios");

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
    backlogs = [{ msg: "Bot Started", style: "done", time: dayjs() }];

    chathistory = [];
    openai = new OpenAI({
        apiKey: process.env.API_KEY,
        baseURL: process.env.BASE_URL,
    });
    nickname = config.client.nickname;
    data = {
        ignored: [],
        words: [],
        current_status: config.client.presence,
        status_change: false,
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

    sendHook = async (hookData) => {
        axios.post(process.env.HOOK, hookData);
    }
    forceNotify = () => {
        backlogjob.run(this);
    }

    /**
     * Sends notification to the defined admin. 
     * @param {string} msg - the message
     * @param {'info' | 'err' | 'done' | 'event'} style - Message style
     */
    notify = (msg, style) => {
        log(msg, style);
        this.backlogs.push({ msg: msg, style: style, time: dayjs() });
    }

    /**
     * Logs the error and notifies the admin of said error.
     * Can be called in a "catch" function.
     * @param {error} err 
     */
    nerrify = (err) => {
        log(err, 'err');
        this.notify(`${err}`, 'err');
        this.forceNotify();
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
        commands(this);
        events(this);
        components(this);

        if (config.handler.mongodb.toggle) mongoose();

        await this.login(process.env.CLIENT_TOKEN || config.client.token);
        if (config.handler.deploy) await deploy(this, config);
        jobs(this);

        chats.setup(this);
        await express(this);
    };
};