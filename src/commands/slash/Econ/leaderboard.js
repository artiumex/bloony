const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { display } = require('../../../tools');
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

        const wallets = await WalletSchema.find({}).sort({ bloons: 'desc' });
        if (wallets.length < 3) return interaction.reply({
            content: `There are not enough players to form a leaderboard!`
        });
        
        const lb = display(client, wallets.slice(0,3));
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(lb.map((e, i) => `${i+1}. ${e.name}:\n${e.bloons.view}\n${e.jewels.view}`).join('\n'))
        
        await interaction.editReply({ embeds: [embed] });
    }
};