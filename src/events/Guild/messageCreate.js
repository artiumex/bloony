const { ChannelType, Message } = require("discord.js");
const config = require("../../config");
const { log, random, error } = require("../../functions");
const { findWallet } = require("../../mongotools");
const WalletSchema = require("../../schemas/WalletSchema");
const ExtendedClient = require("../../class/ExtendedClient");

const yaml = require('js-yaml');
const fs   = require('fs');

const cooldown = new Map();

const { abstain, list } = yaml.load(fs.readFileSync('./src/data/words.yml', 'utf8'));

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

    if (abstain.some(e => e == message.author.username)) return; // if message author's username is present in the abstain list

    var termsCount = 0;
    for (const wl of list) {
      if (wl.user && message.author.username !== wl.user) continue;
      if (wl.words.some(e => message.content.toLowerCase().includes(e.toLowerCase()))) {
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
      Wallet.jewels += output - (100 * Math.floor((Wallet.jewels + output) / 100));
      Wallet.bloons += Math.floor((Wallet.jewels + output) / 100);
      await Wallet.save().catch(error);
      log(`Added ${output} jewels to ${message.author.username}'s wallet. They now have ${Wallet.jewels} jewels.`,'event');
    }



    

    
    /*if (!config.handler.commands.prefix) return;

    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.toggle) {
      try {
        const guildData = await GuildSchema.findOne({ guild: message.guildId });

        if (guildData && guildData?.prefix) prefix = guildData.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandInput = args.shift().toLowerCase();

    if (!commandInput.length) return;

    let command =
      client.collection.prefixcommands.get(commandInput) ||
      client.collection.prefixcommands.get(
        client.collection.aliases.get(commandInput)
      );

    if (command) {
      try {
        if (
          command.structure?.permissions &&
          !message.member.permissions.has(command.structure?.permissions)
        ) {
          await message.reply({
            content:
              config.messageSettings.notHasPermissionMessage !== undefined &&
              config.messageSettings.notHasPermissionMessage !== null &&
              config.messageSettings.notHasPermissionMessage !== ""
                ? config.messageSettings.notHasPermissionMessage
                : "You do not have the permission to use this command.",
          });

          return;
        }

        if (command.structure?.developers) {
          if (!config.users.developers.includes(message.author.id)) {
            setTimeout(async () => {
              await message.reply({
                content:
                  config.messageSettings.developerMessage !== undefined &&
                  config.messageSettings.developerMessage !== null &&
                  config.messageSettings.developerMessage !== ""
                    ? config.messageSettings.developerMessage
                    : "You are not authorized to use this command",
              });
            }, 5 * 1000);
          }

          return;
        }

        if (command.structure?.nsfw && !message.channel.nsfw) {
          await message.reply({
            content:
              config.messageSettings.nsfwMessage !== undefined &&
              config.messageSettings.nsfwMessage !== null &&
              config.messageSettings.nsfwMessage !== ""
                ? config.messageSettings.nsfwMessage
                : "The current channel is not a NSFW channel.",
          });

          return;
        }

        if (command.structure?.cooldown) {
          const cooldownFunction = () => {
            let data = cooldown.get(message.author.id);

            data.push(commandInput);

            cooldown.set(message.author.id, data);

            setTimeout(() => {
              let data = cooldown.get(message.author.id);

              data = data.filter((v) => v !== commandInput);

              if (data.length <= 0) {
                cooldown.delete(message.author.id);
              } else {
                cooldown.set(message.author.id, data);
              }
            }, command.structure?.cooldown);
          };

          if (cooldown.has(message.author.id)) {
            let data = cooldown.get(message.author.id);

            if (data.some((v) => v === commandInput)) {
              await message.reply({
                content:
                  config.messageSettings.cooldownMessage !== undefined &&
                  config.messageSettings.cooldownMessage !== null &&
                  config.messageSettings.cooldownMessage !== ""
                    ? config.messageSettings.cooldownMessage
                    : "Slow down buddy! You're too fast to use this command.",
              });

              return;
            } else {
              cooldownFunction();
            }
          } else {
            cooldown.set(message.author.id, [commandInput]);

            cooldownFunction();
          }
        }

        command.run(client, message, args);
      } catch (error) {
        log(error, "err");
      }
    }*/
  },
};
