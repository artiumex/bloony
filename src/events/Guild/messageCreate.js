const { ChannelType, Message } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

const { chat } = require('../../chat/module');
const reacts = require('../../chat/reacts');
const dadcat = require('../../chat/dadcat');

module.exports = {
  event: "messageCreate",
  /**
   *
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    if (message.author.bot ||
      message.channel.type === ChannelType.DM ||
      client.data.ignored.includes(message.author.username)
    ) return;

    if (client.data.mm.reacts) reacts(client, message);
    if (client.data.mm.dadcat) dadcat(client, message);
    if (client.data.mm.chat) chat(client, message);
  },
};