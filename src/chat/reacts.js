const { random, error, peekText, log } = require('../functions');
const { findWallet } = require('../tools');
const { users } = require('../config');
const Tesseract = require('tesseract.js');


const disableTesseract = false;

async function readTextInImages(content, attachments) {
  const files = attachments.map(e => e.url);
  if (!files.length > 0 || !attachments.size > 0) return content;
  var output = content;

  // replace with for loop
  for (const url of files) {
    console.log(url);
    const { data: { text } } = await Tesseract.recognize(url);
    console.log(text);
    output = `${output} ${text}`;
  }
  
  // ouput 
  return output;
}

module.exports = async (client, message) => {
    const { author, content, attachments } = message;
    const exch_rate = client.data.jwl2bln;
    const delay = client.data.countDelay * 60 * 1000;
    const txt = await readTextInImages(content, attachments);
    var termsCount = 0;
    for (const wl of client.data.words) {
      if (
        wl.ignored && 
        wl.ignored.length > 0 &&
        wl.ignored?.includes(author.username)
      ) continue;
      if (
        wl.allowed && 
        wl.allowed.length > 0 &&
        !wl.allowed?.includes(author.username)
      ) continue;

      if (
        wl.terms
          .filter(word => !word.startsWith('$'))
          .some(e => txt.toLowerCase().includes(e.toLowerCase())) ||
        wl.terms
          .filter(word => word.startsWith('$'))
          .some(e => txt.toLowerCase().split(' ').includes(e.slice(1,e.length).toLowerCase()))
      ) {
        client.notify(`"${wl.name}" detected from "${author.username}": ${peekText(txt, wl.terms)}`, 'r_detect');
        if (wl.awardable) termsCount++;
        await message.react(wl.emoji).catch(error);
        client.stats.reacts++;
      } 
    }

    
    
    setTimeout(async () => {
      var output = 0, reacts = 0, eventType = "event";
      if (message.reactions.cache.size > 0) {
        reacts = message.reactions.cache
          .map(e => e.count)
          .reduce((a,b) => { return a + b });
        output += reacts;
      }
      if (termsCount > 0) {
        eventType = "r_detect";
        for (var i = 0; i < termsCount; i++) output += random(0,2);
      } else if (reacts > 0) {
        eventType = "r_reacts";
      } else if (random(1, 10) == 10) {
        eventType = "r_random";
        output += random(1,5);
      } else return;

      if (users.developers.includes(author.id)) output = Math.round(output/2);

      if (output > 0) {
        const Wallet = await findWallet(author);
        Wallet.bloons += Math.floor((Wallet.jewels + output) / exch_rate);
        Wallet.jewels += output - (exch_rate * Math.floor((Wallet.jewels + output) / exch_rate));
        await Wallet.save().catch(error);
        client.notify(`Added ${output} jewels to ${author.username}'s wallet. ${reacts} of those were from reacts count. They now have ${Wallet.jewels} jewels.`,eventType);
      }
    }, delay);
}