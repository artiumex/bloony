const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const axios = require('axios');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('dadjoke')
        .setDescription('Shares a dadjoke!'),
    options: {
        cooldown: 5000,
        // testing_only: true,
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const dj = await axios.get('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'My Project (https://github.com/artiumex/bloony)'
            }
        });

        if (dj.data.status == 200) {
            const embed = new EmbedBuilder()
                .setColor('DarkGold')
                .setDescription(dj.data.joke);
            
            await interaction.reply({
                embeds: [embed]
            });
            return;
        }
        
        await interaction.reply({
            content: "I can't think of a joke rn :pensive:"
        });
    }
};
