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
        required: true,
        default: false,
    },
    current_status: {
        type: String,
        required: true,
        default: 'just woke :/',
    },
    jwl2bln: {
        type: Number,
        required: true,
        default: 100,
    },
    countDelay: {
        type: Number,
        required: true,
        default: 15,
    },
    ignored: {
        type: Array,
        required: true,
        default: [],
    },
    matchers: {
        reacts: {
            type: Boolean,
            required: false,
            default: false,
        },
        all_msg_matchers: {
            type: Boolean,
            required: false,
            default: true,
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
});

const newmodel = model('BotSettingsSchema', schema);
newmodel.watch().on('change', data => pingCat());

module.exports = newmodel;