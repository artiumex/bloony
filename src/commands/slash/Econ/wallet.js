const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

const { findWallet, newEmbed, display } = require('../../../tools');
const { random } = require('../../../functions');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('wallet')
        .setDescription('Shows your info'),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();

        const Wallet = await findWallet(interaction.user.id);
        const w = await display(client, Wallet);
        const embed = newEmbed(
            `${w.name}'s Wallet`,
            `${w.bloons.view}\n${w.jewels.view}`,
            random
        );
        await interaction.editReply({ embeds: [embed] });
    }
};