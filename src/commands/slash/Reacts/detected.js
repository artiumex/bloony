const { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
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
        const image = new AttachmentBuilder('./src/data/images/co-detected.jpg').setDescription("Carbon Monoxide Detected!");
        await interaction.reply({
            files: [image],
        });
    }
};