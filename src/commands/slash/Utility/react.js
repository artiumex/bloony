const { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');

const ExtendedClient = require('../../../class/ExtendedClient');

const rawReacts = yaml.load(fs.readFileSync('./src/data/reacts/reacts.yml', 'utf8'));
const reactsList = new Map();
let reactsList_arr = [];
rawReacts.forEach(e => {
    const file_split = e.file.split('.');
    const obj = {
        name: e.name,
        filename: './src/data/reacts/' + e.file,
        id: file_split.slice(0, file_split.length -1).join('.'),
    };
    reactsList.set(obj.id, obj);
    reactsList_arr.push(obj);
});
if (reactsList_arr.length > 25) reactsList_arr = reactsList_arr.slice(0, 24);

const data  = new SlashCommandBuilder()
    .setName('react')
    .setDescription('reacts with a silly picture')
    .addStringOption(option => option.setName('image')
        .setDescription('The image to react with')
        .setRequired(true));
for (const r of reactsList_arr) {
    data.options[0].addChoices({
        name: r.name,
        value: r.id,
    });
}

module.exports = {
    structure: data,
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const image_choice = reactsList.get(interaction.options.getString('image'));
        const image = new AttachmentBuilder(image_choice.filename).setDescription(image_choice.name);
        return interaction.reply({
            files: [image],
        })
    }
};
