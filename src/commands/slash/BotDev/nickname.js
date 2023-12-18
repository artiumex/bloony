const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Changes the nickname of the bot! Developer command only.')
        .addStringOption(o => o.setName('nickname')
            .setDescription('The string of the new nickname')
            .setMinLength(2)
            .setMaxLength(32)
            .setRequired(true))
        .addBooleanOption(o => o.setName('universal')
            .setDescription('Whether or not to update bot nickname in every server. If false, it will update in this server only.')),
    options: {
        cooldown: 5000,
        developers: true,
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();
        const universal = interaction.options.getBoolean('universal');
        const newNick = interaction.options.getString('nickname');
        if (universal) {
            await client.allNicknames(newNick, "Manual nickname update")
                .catch(client.nerrify);
        } else {
            (await client.guilds.fetch(interaction.guild.id))
                .members.me.setNickname(newNick, "Manual nickname update")
                .catch(client.nerrify);
        }
        interaction.editReply('Successfully updated bot nickname.');
        if (!universal) client.notify(`Manual nickname update: "${newNick}"`, 'event');

    }
};
