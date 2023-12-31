const { model, Schema } = require('mongoose');

module.exports = model('WalletSchema',
    new Schema({
        username: {
            type: String,
            required: true
        },
        userid: {
            type: String,
            required: true
        },
        jewels: {
            type: Number,
            required: false,
            default: 0
        },
        bloons: {
            type: Number,
            required: false,
            default: 0
        },
    })
);