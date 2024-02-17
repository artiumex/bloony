const { model, Schema } = require('mongoose');

module.exports = model('ChatSchema',
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
    })
);