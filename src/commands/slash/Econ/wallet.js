const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

const { display } = require('../../../tools');
const WalletSchema = require('../../../schemas/WalletSchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('wallet')
        .setDescription('Shows your info')
        .addUserOption(e => e
            .setName('user')
            .setDescription('Choose someone to see the wallet of!')
            .setRequired(false)),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();
        const chosenUser = interaction.options.getUser('user') ?? interaction.user;

        const Wallet = await WalletSchema.findOne({ userid: chosenUser.id });
        if (!Wallet) return interaction.editReply({
            content: `Couldn't find the selected user's Wallet!`,
            ephemeral: true,
        });

        const w = await display(client, Wallet);
        const embed = new EmbedBuilder().setTitle(`${w.name}'s Wallet`).setDescription(`${w.bloons.view}\n${w.jewels.view}`);
        await interaction.editReply({ embeds: [embed] });
    }
};