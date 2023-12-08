const { model, Schema } = require('mongoose');

module.exports = model('ChatSchema',
    new Schema({
        userid: {
            type: String,
            required: true
        },
        query: {
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