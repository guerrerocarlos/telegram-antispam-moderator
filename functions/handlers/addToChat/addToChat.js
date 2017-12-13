"use strict";
//libs
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
const config = require('../../config');
//init
module.exports = function ({from, chat, new_chat_member}) {
    if (!new_chat_member || new_chat_member.username !== config.BOT_USERNAME) {
        return Promise.resolve(null);
    }
    const dbPromise = db.addManager({
        chatId: chat.id,
        managerId: from.id
    });
    const messagePromise = bot.sendMessage(from.id, `Теперь нужно дать админские права боту в чате "${chat.title}". Без этого бот не заработает.`);
    return Promise.all([dbPromise, messagePromise]);
};