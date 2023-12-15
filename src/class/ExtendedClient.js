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
     * 
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
        this.users.cache.find(u => u.id == process.env.ADMIN).send(`${selectedStyle.prefix} [${selectedStyle.title}] ${selectedStyle.prefix}\n\`\`\`${msg}\`\`\``);
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
    };
};