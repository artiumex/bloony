const ExtendedClient = require('../class/ExtendedClient');
const Statuses = require('../schemas/StatusSchema');
const { random } = require('../functions');

module.exports = {
    name: 'presences',
    autorun: true,
    skip: false,
    cron: '*/15 * * * *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        if (!client.data.change_status) return;
        const length = await Statuses.count();
        const status = await Statuses.findOne().skip(random(0, length));
        client.user.setPresence({
            activities: [{
                name: 'dablooncat',
                type: 4,
                state: status,
            }]
        });
    }
}