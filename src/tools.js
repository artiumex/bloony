const yaml = require('js-yaml');
const fs   = require('fs');
const { bold, EmbedBuilder } = require('discord.js');

const ExtendedClient = require('./class/ExtendedClient');
const WalletSchema = require("./schemas/WalletSchema");
const { random, error } = require("./functions");

const words = yaml.load(fs.readFileSync('./src/data/words.yml', 'utf8'));
const ignored = yaml.load(fs.readFileSync('./src/data/ignored.yml', 'utf8'));
const presences = yaml.load(fs.readFileSync('./src/data/presences.yml', 'utf8'));

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

module.exports = {
    words,
    ignored,
    presences,
    findWallet,
    newEmbed,
    display,
}