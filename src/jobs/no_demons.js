const ExtendedClient = require('../class/ExtendedClient');

module.exports = {
    name: 'nochristmas',
    autorun: false,
    skip: false,
    cron: '0 0 1 1 *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        await client.user.setAvatar('./src/data/avatars/cat.png').catch(client.nerrify);
        await client.allNicknames('Dabloon Cat', "NormalMaxxing").catch(client.nerrify);
        await client.notify('DabloonCat Mode Active!', 'event');
    }
}