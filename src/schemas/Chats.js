const { model, Schema } = require('mongoose');
const { pingCat } = require('../functions');

const newmodel = model('ChatSchema',
    new Schema({
        isSystem: {
            type: Boolean,
            required: false,
            default: false,
        },
        prompt: {
            type: String,
            required: true
        },
        reply: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        n: {
            type: Boolean,
            required: false,
            default: true,
        },
    })
);

newmodel.watch().on('change', data => pingCat());
module.exports = newmodel;