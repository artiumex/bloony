const ExtendedClient = require('../class/ExtendedClient');
const Bot = require('../schemas/BotSettingsSchema');

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
            25: { name: "Klaus", file: "north.jpg", status: "Christmas DILF" },
            26: { name: "Osiris", file: "osiris.jpg", status: "I'm literally god of the dead AND the living" },
            27: { name: "Horus", file: "horus.jpg", status: "will smite a mf" },
            28: { name: "Set", file: "set.jpg", status: "not evil, just complex" },
            29: { name: "The Lady, Isis", file: "isis.jpg", status: "its just magic you guys" },
            30: { name: "Nepthys", file: "nepthys.jpg", status: "denial is a river in egypt" },
        }
        const now = new Date();
        const god = gods[now.getDate()];
        await client.user.setAvatar('./src/data/avatars/ddays/'+god.file).catch(client.nerrify);
        await client.allNicknames(god.name, "Demon Days Event").catch(client.nerrify);
        await Bot.updateOne({ botid: client.user.id }, { current_status: god.status }).catch(client.nerrify);
        await client.notify(god.name + ' Mode Active!', 'event');
    }
}