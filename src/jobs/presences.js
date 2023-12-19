const ExtendedClient = require('../class/ExtendedClient');
const { presenceChange } = require('../tools');
const Statuses = require('../schemas/StatusSchema');

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
        await Statuses.findOne().skip(random(0, length));
        presenceChange(client, )
    }
}