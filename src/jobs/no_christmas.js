const ExtendedClient = require('../class/ExtendedClient');
const { error } = require('../functions');

module.exports = {
    name: 'nochristmas',
    autorun: false,
    cron: '0 0 26 12 *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        await client.user.setAvatar('./src/data/avatars/cat.png').catch(error);
        await client.notify('DabloonCat Avatar Set!', 'done').catch(error);
        await client.user.setUsername('DabloonCat').catch(error);
        await client.notify('DabloonCat Username Set!', 'done').catch(error);
        await client.notify('DabloonCat Mode Active!', 'event').catch(error);
    }
}