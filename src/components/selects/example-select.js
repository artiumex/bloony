const { StringSelectMenuInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    customId: 'example-select',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {

        const value = interaction.values[0];
        const arr = ['a', 'b', 'c', 'd']
        
        await interaction.update({
            content: `You have selected from the menu: **${value}**. Value: **${arr[value]}**.`,
            components: [],
        });

    }
};
