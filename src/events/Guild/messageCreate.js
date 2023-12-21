const { ChannelType, Message } = require("discord.js");
const config = require("../../config");
const { log, random, error } = require("../../functions");
const { findWallet, presenceChange } = require("../../tools");
const WalletSchema = require("../../schemas/WalletSchema");
const ExtendedClient = require("../../class/ExtendedClient");
const { chat } = require('../../chat/module');

const cooldown = new Map();

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
    if (client.data.ignored.includes(author.username)) return;

    var termsCount = 0;
    for (const wl of client.data.words) {
      if (
        wl.ignored && 
        wl.ignored.length > 0 &&
        (wl.ignored?.includes(author.username || wl.ignored == author.username))
      ) continue;
      if (
        wl.allowed && 
        wl.allowed.length > 0 &&
        (!wl.allowed?.includes(author.username || wl.allowed !== author.username))
      ) continue;

      if (
        wl.terms
          .filter(word => !word.startsWith('$'))
          .some(e => content.toLowerCase().includes(e.toLowerCase())) ||
        wl.terms
          .filter(word => word.startsWith('$'))
          .some(e => content.toLowerCase().split(' ').includes(e.slice(1,e.length).toLowerCase()))
      ) {
        log(`(Emoji) "${wl.terms[0]}" detected from "${author.username}": ${content}`, 'event');
        if (wl.awardable) termsCount++;
        await message.react(wl.emoji).catch(error);
      } 
    }

    var output = 0;
    let eventType = "random";
    if (termsCount > 0) {
      eventType = "Emoji";
      for (var i = 0; i < termsCount; i++) output += random(0,2);
    } else if (random(1, 10) == 10) {
      eventType = "Random";
      output = random(1,5);
    }

    const exch_rate = client.data.jwl2bln;
    if (output > 0) {
      const Wallet = await findWallet(author);
      Wallet.bloons += Math.floor((Wallet.jewels + output) / exch_rate);
      Wallet.jewels += output - (exch_rate * Math.floor((Wallet.jewels + output) / exch_rate));
      await Wallet.save().catch(error);
      log(`(${eventType}) Added ${output} jewels to ${author.username}'s wallet. They now have ${Wallet.jewels} jewels.`,'event');
    }
    chat(client, message);
  },
};