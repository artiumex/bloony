const { ChannelType, Message } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

const { log, random, error, peekText } = require("../../functions");
const { findWallet } = require("../../tools");
// const { chat } = require('../../chat/module');
const { users } = require('../../config');

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

    const exch_rate = client.data.jwl2bln;
    const delay = client.data.countDelay * 60 * 1000;
    var termsCount = 0;
    for (const wl of client.data.words) {
      if (
        wl.ignored && 
        wl.ignored.length > 0 &&
        (wl.ignored?.includes(author.username) || wl.ignored == author.username)
      ) continue;
      if (
        wl.allowed && 
        wl.allowed.length > 0 &&
        (!wl.allowed?.includes(author.username) || wl.allowed !== author.username)
      ) continue;

      if (
        wl.terms
          .filter(word => !word.startsWith('$'))
          .some(e => content.toLowerCase().includes(e.toLowerCase())) ||
        wl.terms
          .filter(word => word.startsWith('$'))
          .some(e => content.toLowerCase().split(' ').includes(e.slice(1,e.length).toLowerCase()))
      ) {
        client.notify(`(Emoji) "${wl.name}" detected from "${author.username}": ${peekText(content, wl.terms)}`, 'event');
        if (wl.awardable) termsCount++;
        await message.react(wl.emoji).catch(error);
      } 
    }

    
    // chat(client, message);
    setTimeout(async () => {
      var output = 0, reacts = 0, eventType = "random";
      if (message.reactions.cache.size > 0) {
        reacts = message.reactions.cache
          .map(e => e.count)
          .reduce((a,b) => { return a + b });
        output += reacts;
      }
      if (termsCount > 0) {
        eventType = "Emoji";
        for (var i = 0; i < termsCount; i++) output += random(0,2);
      } else if (reacts > 0) {
        eventType = "Reacts";
      } else if (random(1, 10) == 10) {
        eventType = "Random";
        output += random(1,5);
      } else return;

      if (users.developers.includes(author.id)) output = Math.round(output/2);

      if (output > 0) {
        const Wallet = await findWallet(author);
        Wallet.bloons += Math.floor((Wallet.jewels + output) / exch_rate);
        Wallet.jewels += output - (exch_rate * Math.floor((Wallet.jewels + output) / exch_rate));
        await Wallet.save().catch(error);
        client.notify(`(${eventType}) Added ${output} jewels to ${author.username}'s wallet. ${reacts} of those were from reacts count. They now have ${Wallet.jewels} jewels.`,'event');
      }
    }, delay);
  },
};