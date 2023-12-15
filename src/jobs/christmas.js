const ExtendedClient = require('../class/ExtendedClient');
const { log } = require('../functions');

module.exports = {
    name: 'christmas',
    autorun: false,
    cron: '0 0 25 12 *',
    /**
     * @param {ExtendedClient} client
     */
    run: (client) => {
        client.user.setAvatar('./src/data/avatars/christmas_cat.jpg')
            .then(user => log(`Christmas avatar set!`, 'event'))
            .catch(console.error);
    }
}