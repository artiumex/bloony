const ExtendedClient = require('../class/ExtendedClient');
const Statuses = require('../schemas/StatusSchema');
const { random, pingCat } = require('../functions');

module.exports = {
    name: 'presences',
    autorun: false,
    skip: false,
    cron: '0 * * * *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        pingCat();
    }
}