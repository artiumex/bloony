const ExtendedClient = require('../class/ExtendedClient');
const { error } = require('../functions');

module.exports = {
    name: 'christmas',
    autorun: false,
    skip: false,
    cron: '0 0 23 12 *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        await client.user.setAvatar('./src/data/avatars/christmas_cat.jpg').catch(error);
        await client.notify('Christmas Kitty Avatar Set!', 'done').catch(error);
        await client.user.setUsername('ChristmasKitty').catch(error);
        await client.notify('Christmas Kitty Username Set!', 'done').catch(error);
        await client.notify('Christmas Kitty Mode Active!', 'event').catch(error);
    }
}