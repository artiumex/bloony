const { ChannelType, Message } = require("discord.js");
const config = require("../../config");
const { log, random, error } = require("../../functions");
const { words, ignored, findWallet } = require("../../tools");
const WalletSchema = require("../../schemas/WalletSchema");
const ExtendedClient = require("../../class/ExtendedClient");

const cooldown = new Map();

const exch_rate = 50;

module.exports = {
  event: "messageCreate",
  /**
   *
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    const { author, content } = message;
    if (author.bot || message.channel.type === ChannelType.DM) return;

    if (ignored.includes(author.username)) return;

    var termsCount = 0;
    for (const wl of words) {
      if (
        wl.ignored && 
        wl.ignored.length > 0 &&
        (wl.ignored?.includes(author.username || wl.ignored == author.username))) continue;
      if (
        wl.allowed && 
        wl.allowed.length > 0 &&
        (!wl.allowed?.includes(author.username || wl.allowed !== author.username))) continue;

      if (
        wl.words
        .filter(word => !word.startsWith('$'))
        .some(e => content.toLowerCase().includes(e.toLowerCase())) ||
        wl.words
        .filter(word => word.startsWith('$'))
        .some(e => content.toLowerCase().split(' ').includes(e.slice(1,e.length).toLowerCase()))) {
        log(`(emoji) "${wl.words[0]}" detected from "${author.username}": ${content}`, 'event');
        termsCount++;
        await message.react(wl.emoji).catch(error);
      } 
    }

    var output = 0;
    if (termsCount > 0) {
      for (var i = 0; i < termsCount; i++) output += random(0,2);
    } else {
      if (random(1, 10) == 10) {
        output = random(1,5);
      }
    }

    if (output > 0) {
      const Wallet = await findWallet(author.id).catch(error);
      Wallet.bloons += Math.floor((Wallet.jewels + output) / exch_rate);
      Wallet.jewels += output - (exch_rate * Math.floor((Wallet.jewels + output) / exch_rate));
      await Wallet.save().catch(error);
      log(`Added ${output} jewels to ${author.username}'s wallet. They now have ${Wallet.jewels} jewels.`,'event');
    }
  },
};
