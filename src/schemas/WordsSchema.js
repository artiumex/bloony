const { model, Schema } = require('mongoose');
const { pingCat } = require('../functions');

const newmodel = model('WordsSchema', new Schema({
    name: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        required: true
    },
    terms: {
        type: [String],
        required: true
    },
    allowed: {
        type: [String],
        required: false
    },
    ignored: {
        type: [String],
        required: false
    },
    awardable: {
        type: Boolean,
        required: false,
        default: false,
    },
    universal: {
        type: Boolean,
        required: false,
        default: false,
    },
}));

newmodel.watch().on('change', data => pingCat());
module.exports = newmodel;