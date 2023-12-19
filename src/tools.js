const yaml = require('js-yaml');
const fs = require('fs');
const { bold, EmbedBuilder } = require('discord.js');

const ExtendedClient = require('./class/ExtendedClient');
const WalletSchema = require("./schemas/WalletSchema");
const { random, error, log } = require("./functions");

const Words = require('./schemas/WordsSchema');
const Statuses = require('./schemas/StatusSchema');
const Ignored = require('./schemas/IgnoredSchema');
const Bot = require('./schemas/BotSettingsSchema');

const rawViews = yaml.load(fs.readFileSync('./src/data/views.yml', 'utf8'));
const viewsList = new Map();
rawViews.forEach(e => { viewsList.set(e.name, e) });

/**
 * Finds the wallet of a given User ID
 * Creates one if it doesn't exist
 * 
 * @param {string} id - The ID of the User
 * @returns The Schema of a User
 */
const findWallet = async id => {
    let Wallet;
    try {
        Wallet = await WalletSchema.findOne({ userid: id });
        if (!Wallet) Wallet = new WalletSchema({
            userid: id,
        });
    } catch {
        Wallet = new WalletSchema({
        userid: id,
        }).catch(error);
    }
    return Wallet
}

/**
 * Generates an embed
 * 
 * @param {string} title - The title of the embed
 * @param {string} desc - The description of the embed
 * @param {'red' | 'blue' | 'green' | 'random' | undefined} color - The color of the embed
 * @returns EmbedBuilder
 */
const newEmbed = (title, desc, color) => {
    const colors = {
        red: [225, 0, 0],
        blue: [0, 0, 255],
        green: [0, 255, 0],
        random: random(0, 16777215),
    }
    const output = new EmbedBuilder().setTitle(title).setDescription(desc).setColor(colors[color] || colors.random);
    return output
}

/**
 * Returns the display data for a wallet or Wallets
 * 
 * @param {ExtendedClient} client 
 * @param {Object | Object[]} Wallet - the Wallet(s) to display
 * @return {Object | Object[]} - the display(s)
 */
const display = async (client, Wallet) => {
    const isArray = Array.isArray(Wallet);
    const list = isArray ? Wallet : [Wallet];
    var output = [];
    for (const w of list) {
        const user = await client.users.cache.get(w.userid);
        output.push({
            name: bold(user.username),
            userid: w.userid,
            user: user,
            jewels: {
                amount: w.jewels,
                view: `${views(client, 'jewels')} ${bold(w.jewels)}`,
            },
            bloons: {
                amount: w.bloons,
                view: `${views(client, 'bloons')} ${bold(w.bloons)}`,
            },
        });
    }
    return isArray ? output : output[0];
} 


const views = (client, name) => { 
    var output = ':heart:'; // default output
    const lilView = viewsList.get(name);
    if (lilView) output = client.emojis.cache.find(emoji => emoji.id === lilView.emojiID) || lilView.defaultText;
    return output
}

/**
 * 
 * @param {ExtendedClient} client 
 */
const presenceChange = async (client, state) => {
    client.user.setPresence({
        activities: [{
            name: 'dablooncat',
            type: 4,
            state: state,
        }]
    });
}

/**
 * 
 * @param {ExtendedClient} client 
 */
const changeData = async (client) => {
    const words = await Words.find({});
    const ignored = await Ignored.find({});
    const status = await Statuses.find({});
    const settings = await Bot.findOne({ botid: process.env.DISCORD_BOTID });

    const ss = status.map(e => { if (e.enabled) return e.phrase });
    
    const output = {
        words: words.map(e => {
            const output = {
                emoji: e.emoji,
                terms: e.terms,
            }
            if (e.allowed.length > 0) output.allowed = e.allowed;
            if (e.ignored.length > 0) output.ignored = e.ignored;
            return output
        }),
        presence: ss[random(0, ss.length-1)],
        change_status: settings.change_status,
        ignored: ignored.map(e => { if (e.enabled) return e.userid }),
    };
    client.data = output;
    if (client.data.change_status) presenceChange(client, client.data.presence);
    log('Updated bot data', 'info');
}

module.exports = {
    findWallet,
    newEmbed,
    display,
    changeData,
    presenceChange,
}