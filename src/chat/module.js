const fs = require('fs');
const yaml = require('js-yaml');

const Chats = require('../schemas/Chats');
const { log } = require('../functions');
const roleNames = ["system", "user", "assistant"];

const setup = async (client) => {
    client.nickname = `<@${client.user.id}>`;
    const past_msgs = [];
    for (const msg of yaml.load(fs.readFileSync('./src/chat/personality.yml', 'utf8'))) {
        past_msgs.push({
            userid: msg.id || "system",
            content: msg.text,
        });
        if (msg.reply) past_msgs.push({
            userid: "assisstant",
            content: msg.reply,
        });
    }
    const chats = await Chats.find({}).sort({ date: 1 });
    client.chathistory = client.chathistory.concat(past_msgs, chats);
    log("Loaded past chats", 'info');
}

const chat = async (client, message) => {
    if (message.author.bot) return;

    if (!message.content.includes(client.nickname)) return;
    const text = message.content.replace(client.nickname, '');

    const sm = client.chathistory.filter(e => roleNames.includes(e.userid));
    const pm = client.chathistory.filter(e => e.userid == message.author.id);
    
    let past_text_inputs = [];
    for (const k of sm.concat(pm)) {
        if (roleNames.includes(k.userid)) {
            past_text_inputs.push({
                role: k.userid,
                content: k.content,
            })
        } else {
            past_text_inputs.push({
                role: "user",
                content: k.query,
            });
            past_text_inputs.push({
                role: "assistant",
                content: k.reply,
            })
        }
    }
    past_text_inputs.push({ role: "user", content: text });

    message.channel.sendTyping();
    const completion = await client.openai.chat.completions.create({ messages: past_text_inputs, model: "gpt-3.5-turbo" }).catch(err => log(err, 'err'));
    if (!completion) return log("AI call failed.", 'warn');
    const botResponse = completion.choices[0].message.content;
    
    await message.channel.send(botResponse);
    const newChat = new Chats({ userid: message.author.id, query: text, reply: botResponse, date: new Date() });
    await newChat.save();
    client.chathistory.push({ userid: message.author.id, query: text, reply: botResponse});
}

module.exports = {
    setup,
    chat,
}