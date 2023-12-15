const ExtendedClient = require('../class/ExtendedClient');

module.exports = {
    name: 'nochristmas',
    autorun: false,
    skip: false,
    cron: '0 0 26 12 *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        await client.user.setAvatar('./src/data/avatars/cat.png').catch(client.nerrify);
        await client.allNicknames('DabloonCat', "NormalMaxxing").catch(client.nerrify);
        await client.notify('DabloonCat Mode Active!', 'event');
    }
}