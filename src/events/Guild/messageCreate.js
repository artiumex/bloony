const { ChannelType, Message } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

const { chat } = require('../../chat/module');
const reacts = require('../../chat/reacts');
const dadcat = require('../../chat/dadcat');
const logging = require('../../chat/logging');

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
    // anyone and everyone \/
    //logging(client, message);
      
    if (client.data.ignored.includes(message.author.username)) return;
    // only people not on ignore list \/
    if (client.data.matchers.reacts) reacts(client, message);
    if (client.data.matchers.all_msg_matchers) dadcat(client, message);
    chat(client, message);
  },
};