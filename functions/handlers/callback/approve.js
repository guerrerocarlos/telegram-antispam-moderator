"use strict";
//libs
//modules
const bot = require('../../components/bot');
//init
module.exports = function ({message, payload: [chatId, messageId]}) {
    return Promise.all([
        bot.deleteMessage(message.chat.id, message.message_id),
        bot.deleteMessage(message.chat.id, message.reply_to_message.message_id)
    ]);
};