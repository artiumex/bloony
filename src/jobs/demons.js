const ExtendedClient = require('../class/ExtendedClient');

module.exports = {
    name: 'demons',
    autorun: false,
    skip: false,
    cron: '0 17 26-31 12 *', // will run at 5pm everyday December 26-30
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        const gods = {
            26: { name: "Osiris", file: "osiris.jpg" },
            27: { name: "Horus", file: "horus.jpg" },
            28: { name: "Set", file: "set.jpg" },
            29: { name: "Isis", file: "isis.jpg" },
            30: { name: "Nepthys", file: "nepthys.jpg" },
        }
        const now = new Date();
        const god = gods[now.getDate()];
        await client.user.setAvatar('./src/data/avatars/ddays/'+god.file).catch(client.nerrify);
        await client.allNicknames(god.name, "Demon Days Event").catch(client.nerrify);
        await client.notify(god.name + ' Mode Active!', 'event');
    }
}