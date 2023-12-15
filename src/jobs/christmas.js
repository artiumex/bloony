const ExtendedClient = require('../class/ExtendedClient');

module.exports = {
    name: 'christmas',
    autorun: false,
    skip: false,
    cron: '0 0 23 12 *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        await client.user.setAvatar('./src/data/avatars/christmas_cat.jpg').catch(client.nerrify);
        await client.user.setUsername('ChristmasKitty').catch(client.nerrify);
        await client.notify('Christmas Kitty Mode Active!', 'event');
    }
}