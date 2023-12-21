const { model, Schema } = require('mongoose');

module.exports = model('StatusSchema', new Schema({
    phrase: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
}));