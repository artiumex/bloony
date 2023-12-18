const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { log } = require('../../../functions');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('detected')
        .setDescription('Carbon monoxide detected!'),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const sticker = client.stickers.cache.get(1180054302077767770);
        await interaction.reply({
            stickers: sticker,
        });

    }
};
//1180054302077767770