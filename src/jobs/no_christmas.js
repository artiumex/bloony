const ExtendedClient = require('../class/ExtendedClient');
const { log } = require('../functions');

module.exports = {
    name: 'nochristmas',
    autorun: false,
    cron: '0 0 26 12 *',
    /**
     * @param {ExtendedClient} client
     */
    run: (client) => {
        client.user.setAvatar('./src/data/avatars/christmas_cat.jpg')
            .then(user => log(`Reverted to normal avatar!`, 'event'))
            .catch(console.error);
    }
}