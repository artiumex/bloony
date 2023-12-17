const { log } = require('../functions');
const { changeData, presenceChange } = require('../tools');
const ExtendedClient = require('../class/ExtendedClient');

const express = require("express");
const app = express();

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = (client) => {
    changeData(client);

    app.listen(process.env.SERVERPORT, () => {
        log("Server running on port " + process.env.SERVERPORT, 'done');
    });

    app.get('/grab', (req, res, next) => {
        res.json({ status: client.user.presence.activities[0].state });
    });

    app.get('/updated', async (req, res) => {
        await changeData(client);
        res.json({ noted: true });
    });
}