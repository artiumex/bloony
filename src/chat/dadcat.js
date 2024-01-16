const { random } = require("../functions");

const IM_MATCH = /\b((?:i|l)(?:(?:'|`|‛|‘|’|′|‵)?m| am)) ([\s\S]*)/i;
const FORMAT_MATCH = /(\*\*?\*?|``?`?|__?|~~|\|\|)+/i;

// Function to calculate whether a message has enough uppercase characters to be considered "shouting"
function volumeDown(message)  {
    let individualCharacters = message.split('').filter((a) => !a.match(/\s/));
    // If the message has no spaces, it's not shouting (probably)
    if (message.indexOf(' ') === -1) return false;
    let uppercaseCharacters = individualCharacters.filter((a) =>
      a.match(/[A-Z]/),
    ).length;
    // If the message has more than 60% uppercase characters, it's shouting
    return uppercaseCharacters / individualCharacters.length >= 0.6;
}

module.exports = (client, msg) => {
    // I'm matcher
    if ( msg.content.match(IM_MATCH)) {
        if (Math.random() * 10 < 8) return;
        let imMatchData = msg.content.match(IM_MATCH);
        let formattingMatchData = msg.content.match(FORMAT_MATCH);
        let nick = msg.guild.id ? msg.guild.members.me.nickname : null;
        let hiContent = !formattingMatchData || formattingMatchData.index > imMatchData.index
            ? `${imMatchData[2]}`
            : `${formattingMatchData[0]}${imMatchData[2]}`;
        console.log(nick);
        let imContent = nick ? nick : Math.random() * 100 > 99 ? 'dbaloobnycatt' : 'DabloonCat';

        msg.channel
            .send(`Hi ${hiContent}, I'm ${imContent}!`)
            .catch(client.nerrify);
        return;
    }
    // End I'm matcher
    // Caps matcher
    if (volumeDown(msg.content)) {
        msg.channel
            .send('Keep your voice down!')
            .catch(client.nerrify);
        return;
    }
    // End of Caps matcher
}