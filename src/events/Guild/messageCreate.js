const { ChannelType, Message } = require("discord.js");
const config = require("../../config");
const { log, random, error } = require("../../functions");
const { words, ignored, findWallet } = require("../../tools");
const WalletSchema = require("../../schemas/WalletSchema");
const ExtendedClient = require("../../class/ExtendedClient");

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
    if (message.author.bot || message.channel.type === ChannelType.DM) return;

    if (ignored.includes(message.author.username)) return;

    var termsCount = 0;
    for (const wl of words) {
      if (
        wl.ignored && 
        wl.ignored.length > 0 &&
        (wl.ignored?.includes(message.author.username || wl.ignored == message.author.username))) continue;
      if (
        wl.allowed && 
        wl.allowed.length > 0 &&
        (!wl.allowed?.includes(message.author.username || wl.allowed !== message.author.username))) continue;

      if (
        wl.words
        .filter(word => !word.startsWith('$'))
        .some(e => message.content.toLowerCase().includes(e.toLowerCase())) ||
        wl.words
        .filter(word => word.startsWith('$'))
        .some(e => message.content.toLowerCase().split(' ').includes(e.slice(1,e.length).toLowerCase()))) {
        log(`(emoji) "${wl.words[0]}" detected from "${message.author.username}": ${message.content}`, 'event');
        termsCount++;
        await message.react(wl.emoji).catch(error);
      } 
    }

    var output = 0;
    if (termsCount > 0) {
      for (var i = 0; i < termsCount; i++) output += random(0,2);
    } else {
      if (random(1, 10) == 10) {
        output = random(1,3);
      }
    }
    if (output > 0) {
      const Wallet = await findWallet(message.author.id).catch(error);
      Wallet.bloons += Math.floor((Wallet.jewels + output) / 100);
      Wallet.jewels += output - (100 * Math.floor((Wallet.jewels + output) / 100));
      await Wallet.save().catch(error);
      log(`Added ${output} jewels to ${message.author.username}'s wallet. They now have ${Wallet.jewels} jewels.`,'event');
    }
  },
};
