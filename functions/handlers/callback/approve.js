"use strict";
//libs
//modules
const bot = require('../../components/bot');
//init
module.exports = function ({callbackMessageId, payload: [chatId, messageId]}) {
    chatId = parseInt(chatId);
    callbackMessageId = parseInt(callbackMessageId);
    messageId = parseInt(messageId);
    return Promise.all([
        bot.deleteMessage(chatId, messageId),
        bot.deleteMessage(chatId, callbackMessageId)
    ]);
};