const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { presenceChange } = require('../../../tools');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Changes the status of the bot! Developer command only.')
        .addStringOption(o => o.setName('status')
            .setDescription('The string of the new custom status')
            .setMinLength(2)
            .setMaxLength(128)
            .setRequired(true)),
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
        const status = interaction.options.getString('status');
        await presenceChange(client, status);
        interaction.editReply('Successfully updated bot presence.');
        client.notify(`Manual presence update: "${status}"`, 'event');
    }
};
