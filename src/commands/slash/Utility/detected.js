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
        await interaction.reply({
            stickers: client.guilds.cache.get("781397300647559188").stickers.cache.filter(s => s.name === "carbon monoxide detected"),
        });

    }
};
//1180054302077767770