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
    countDelay: {
        type: Number,
        required: true
    },
    ignored: {
        type: Array,
        required: true
    },
    mm: {
        reacts: {
            type: Boolean,
            required: false,
            default: false,
        },
        dadcat: {
            type: Boolean,
            required: false,
            default: false,
        },
        chat: {
            type: Boolean,
            required: false,
            default: false,
        },
    }
});

const newmodel = model('BotSettingsSchema', schema);
newmodel.watch().on('change', data => pingCat());

module.exports = newmodel;