const ExtendedClient = require('../class/ExtendedClient');
const { presences } = require('../tools');
const { random } = require('../functions');

module.exports = {
    name: 'presences',
    cron: '*/15 * * * *',
    // cron: '*/15 * * * * *',
    /**
     * @param {ExtendedClient} client
     */
    run: (client) => {
        console.log('running presence job');
        client.user.setPresence({
            activities: [{
                name: 'dablooncat',
                type: 4,
                state: presences[random(0,presences.length)],
            }]
        });
    }
}