const ExtendedClient = require('../class/ExtendedClient');

module.exports = {
    name: 'christmas',
    autorun: false,
    skip: false,
    cron: '0 12 15 12 *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        await client.user.setAvatar('./src/data/avatars/christmas_monkey.jpg').catch(client.nerrify);
        await client.allNicknames('ChristmasMonkey', "ChristmasMonkeyMaxxing").catch(client.nerrify);
        await client.notify('Christmas Monkey Mode Active!', 'event');
    }
}