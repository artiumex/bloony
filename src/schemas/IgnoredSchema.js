const { model, Schema } = require('mongoose');
const { pingCat } = require('../functions');

const schema = new Schema({
    userid: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
});

const newmodel = model('IgnoredSchema', schema);
newmodel.watch().on('change', data => pingCat());

module.exports = newmodel;