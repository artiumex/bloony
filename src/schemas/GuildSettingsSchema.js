const { model, Schema } = require('mongoose');
const { pingCat } = require('../functions');

const newmodel = model('GuildSettingsSchema', new Schema({
    botid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    guildid: {
        type: String,
        required: true
    },
    countDelay: {
        type: Number,
        required: false,
        default: 15,
    },
    matchers: {
        reacts: {
            type: Boolean,
            required: false,
            default: false,
        },
        ai: {
            type: Boolean,
            required: false,
            default: false,
        },
        all_msg_matchers: {
            type: Boolean,
            required: false,
            default: false,
        },
        i_am: {
            type: Boolean,
            required: false,
            default: false,
        },
        yelling: {
            type: Boolean,
            required: false,
            default: false,
        },
    }
}));

newmodel.watch().on('change', data => pingCat());
module.exports = newmodel;