const { model, Schema } = require('mongoose');
const { pingCat } = require('../functions');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    botid: {
        type: String,
        required: true
    },
    change_status: {
        type: Boolean,
        required: true
    },
    current_status: {
        type: String,
        required: true
    },
    jwl2bln: {
        type: Number,
        required: true
    },
    ignored: {
        type: Array,
        required: true
    },
});

const newmodel = model('BotSettingsSchema', schema);
newmodel.watch().on('change', data => pingCat());

module.exports = newmodel;