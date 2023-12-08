const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Shows top 3 definitions for a term on Urban Dictionary')
        .addStringOption(option =>
            option.setName('term')
                .setDescription('The term to look up')
                .setRequired(true)),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();
        const term = interaction.options.getString('term');
        const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${term}`).catch((error) => {console.error(error);});
        
        const trimmer = (text, maxLength) => {
            var output = text;
            if (output.length >= maxLength) output = output.slice(0, maxLength-4) + '...';
            return output; 
        }
        const embedder = ind => {
            const definition = response.data.list[ind];
            const newEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Define: ${term}`)
            .setURL(definition.permalink)
            .setDescription(trimmer(definition.definition, 4096))
            .addFields(
                { name: '\u200B', value: `Thumbs Up :thumbsup:: ${definition.thumbs_up}` }
            )
            .setTimestamp()
            .setFooter({ text: 'Provided by Urban Dictionary' });
            if (definition.example.length > 1) newEmbed.addFields({ name: 'Example:', value: trimmer(definition.example, 1024) });
            return newEmbed
        }

        var embeds = [];
        for (var i = 0; i < 3; i++){
            if (response.data.list.length < i+1) continue;
            embeds.push(embedder(i));
        }

        interaction.editReply({ embeds: embeds });
    }
};