const fs = require('fs');
const yaml = require('js-yaml');
const OpenAI = require("openai");

const Chats = require('../schemas/Chats');
const { log } = require('../functions');

let perm_msgs = [];
let temp_msgs = [];
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.BASE_URL,
});

/*
    isSystem: boolean (if true, then the system prompts)
    prompt: the prompt to ask
    reply: the response to the prompt from the assistant
*/

const cnsldtmsgs = () => {
    const a = perm_msgs, b = temp_msgs;
    return a.concat(b)
}

const resettemp = async () => {
    perm_msgs = [];
    temp_msgs = [];
    await setup();
    log('Reset non-persistent chats.', 'info');
}

const setup = async () => {
    let TEMPLIST = [];
    TEMPLIST.push.apply(TEMPLIST, yaml.load(fs.readFileSync('./src/chat/prompts/personality.yml', 'utf8')));
    // for (const file of fs.readdirSync('./src/chat/prompts/background').filter(e => e.endsWith('.yml'))) {
    //     TEMPLIST.push.apply(TEMPLIST, yaml.load(fs.readFileSync('./src/chat/prompts/background/' + file, 'utf8')));
    // }
    TEMPLIST.push.apply(TEMPLIST, await Chats.find({ n: true }).sort({ date: 1 }));

    for (const block of TEMPLIST) {
        if (!block.prompt || !block.reply) continue;
        perm_msgs.push.apply(perm_msgs, [
            {
                role: block.isSystem ? 'system' : 'user',
                content: block.prompt
            }, {
                role: 'assistant',
                content: block.reply
            }
        ])
    }

    log("Loaded persistent chats", 'info');
}


const chat = async (client, message) => {
    if (message.author.bot) return;
    if (!message.content.includes(`<@${client.user.id}>`)) return;
    let prompt = message.content.replace(`<@${client.user.id}>`, '');
    temp_msgs.push({
        role: 'user',
        content: prompt,
    });
    const pastmsgs = cnsldtmsgs();

    message.channel.sendTyping();
    const completion = await openai.chat.completions.create({ messages: pastmsgs, model: "gpt-3.5-turbo" }).catch(err => log(err, 'err'));
    if (!completion) {
        temp_msgs.pop();
        return log("AI call failed.", 'warn');
    }
    client.stats.ai++;
    const botResponse = completion.choices[0].message.content;
    temp_msgs.push({
        role: 'assistant',
        content: botResponse
    });
    await message.channel.send({ content: botResponse });
}

module.exports = {
    setup,
    chat,
    resettemp,
    cnsldtmsgs,
}