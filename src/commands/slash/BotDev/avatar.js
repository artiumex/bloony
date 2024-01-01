const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Changes the avatar of the bot! Developer command only.')
        .addAttachmentOption(e => e.setName('avatar').setDescription('The new avatar image.').setRequired(true)),
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
        const attachment = interaction.options.getAttachment('avatar');
        await client.user.setAvatar(attachment.attachment).catch(client.nerrify);
        interaction.editReply('Successfully updated bot avatar.');
        client.notify(`Manual avatar update.`, 'event');
    }
};
