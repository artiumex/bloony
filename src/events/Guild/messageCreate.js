const { ChannelType, Message } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

const { chat } = require('../../chat/module');
const reacts = require('../../chat/reacts');
const dadcat = require('../../chat/dadcat');
//const logging = require('../../chat/logging');

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

    const guildSettings = client.data.guilds.get(message.guildId).matchers;
    const defSettings = client.data.matchers;

    // anyone and everyone \/
    //logging(client, message);
    // end universal matchers


    // ignore people \/
    if (client.data.ignored.includes(message.author.username)) return;
    // only people not on ignore list \/


    if (
      defSettings.reacts &&
      guildSettings.reacts
    ) reacts(client, message);

    if (
      defSettings.all_msg_matchers &&
      guildSettings.all_msg_matchers
    ) dadcat(client, message);

    if (
      defSettings.ai &&
      guildSettings.ai
    ) chat(client, message);
  },
};