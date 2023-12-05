const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { newEmbed, display } = require('../../../tools');
const WalletSchema = require('../../../schemas/WalletSchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('shows the leaderboard'),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();

        let lb = (await WalletSchema.find({}).sort({ bloons: 'desc' })).slice(0,3);
        if (lb.length < 3) {
            interaction.reply({
                content: `There are not enough players to form a leaderboard!`
            });
            return;
        }
        
        const embed = newEmbed(
            'Leaderboard',
            (await display(client, lb)).map(e => `${e.name}: ${e.bloons.view}`).join('\n'),
            'blue'
        );
        await interaction.editReply({ embeds: [embed] });
    }
};