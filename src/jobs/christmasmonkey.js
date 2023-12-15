const ExtendedClient = require('../class/ExtendedClient');
const { error } = require('../functions');

module.exports = {
    name: 'christmas',
    autorun: false,
    skip: false,
    cron: '0 12 15 12 *',
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        await client.user.setAvatar('./src/data/avatars/christmas_monkey.jpg').catch(error);
        await client.notify('Christmas Monkey Avatar Set!', 'done').catch(error);
        await client.user.setUsername('ChristmasMonkey').catch(error);
        await client.notify('Christmas Monkey Username Set!', 'done').catch(error);
        await client.notify('Christmas Monkey Mode Active!', 'event').catch(error);
    }
}