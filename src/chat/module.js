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

const resettemp = () => {
    temp_msgs = [];
    log('Reset non-persistent chats.', 'info')
}

const setup = async () => {
    let TEMPLIST = [];
    TEMPLIST.push.apply(TEMPLIST, yaml.load(fs.readFileSync('./src/chat/personality.yml', 'utf8')));
    TEMPLIST.push.apply(TEMPLIST, await Chats.find({}).sort({ date: 1 }));

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
    // if not include trigger words: return
    if (!message.content.toLowerCase().includes('bloony')) return;
    // remove later
    const pastmsgs = perm_msgs.concat(temp_msgs);
    console.log(pastmsgs);

    message.channel.sendTyping();
    const completion = await openai.chat.completions.create({ messages: pastmsgs, model: "gpt-3.5-turbo" }).catch(err => log(err, 'err'));
    if (!completion) return log("AI call failed.", 'warn');
    const botResponse = completion.choices[0].message.content;
    await message.channel.send({ content: botResponse });

    temp_msgs.push.apply(temp_msgs, [
        {
            role: 'user',
            content: message.content,
        }, {
            role: 'assistant',
            content: botResponse
        }
    ]);
}

module.exports = {
    setup,
    chat,
    resettemp,
}