const axios = require('axios');
const ExtendedClient = require('../class/ExtendedClient');
const { random, error, log } = require('../functions');

module.exports = {
    name: 'data',
    autorun: true,
    skip: false,
    cron: '0 * * * *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        const response = await axios.get(process.env.GRABURL).catch(error);
        if (!response) return;
        client.data = response.data;
        client.user.setPresence({
            activities: [{
                name: 'dablooncat',
                type: 4,
                state: client.data.presence,
            }]
        });
        log('Updated bot data', 'info');
    }
}