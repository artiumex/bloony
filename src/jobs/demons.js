const ExtendedClient = require('../class/ExtendedClient');
const Bot = require('../schemas/BotSettingsSchema');

module.exports = {
    name: 'demons',
    autorun: false,
    skip: false,
    cron: '0 17 20-31 12 *', // will run at 5pm everyday December 20-31
    /**
     * @param {ExtendedClient} client
     */
    run: async (client) => {
        const personas = {
            20: { name: "Christmas Monkey", file: "christmas_monkey.jpg", status: "theres no song about a christmas monkey", reason: "Holiday Indentity Crisis" },
            22: { name: "Christmas Kitty", file: "christmas_cat.jpg", status: "im a cat meow", reason: "Holiday Indentity Crisis" },
            24: { name: "Klaus", file: "north.jpg", status: "Christmas DILF", reason: "Holiday Indentity Crisis" },
            26: { name: "Osiris", file: "osiris.jpg", status: "I'm literally persona of the dead AND the living" },
            27: { name: "Horus", file: "horus.jpg", status: "will smite a mf" },
            28: { name: "Set", file: "set.jpg", status: "not evil, just complex" },
            29: { name: "The Lady, Isis", file: "isis.jpg", status: "its just magic you guys" },
            30: { name: "Nepthys", file: "nepthys.jpg", status: "denial is a river in egypt" },
            31: { name: "Dabloon Cat", file: "cat.jpg", status: "happy new year!", reason: "NormalMaxxing" },
        }
        const now = new Date();
        const persona = personas[now.getDate()];
        if (!persona) return;

        await client.user.setAvatar('./src/data/avatars/'+persona.file).catch(client.nerrify);
        await client.allNicknames(persona.name, persona.reason ?? "Demon Days Event").catch(client.nerrify);
        await Bot.updateOne({ botid: client.user.id }, { current_status: persona.status }).catch(client.nerrify);
        await client.notify(persona.name + ' Mode Active!', 'event');
    }
}