const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Component test.'),
    options: {
        // cooldown: 5000,
        testing_only: true,
        developers: true,
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const select_menu = new StringSelectMenuBuilder()
            .setCustomId('example-select')
            .setPlaceholder('Example Select menu')
            .addOptions(
                { label: 'Option 1', value: '0' },
                { label: 'Option 2', value: '1' },
                { label: 'Option 3', value: '2' },
            );
        select_menu.addOptions({ label: 'Option 4', value: '3' });
        await interaction.reply({
            content: 'Select one of the components below.',
            components: [
                new ActionRowBuilder().addComponents(select_menu)
            ]
        });
    }
};