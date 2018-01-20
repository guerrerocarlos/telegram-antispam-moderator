"use strict";
//libs
//modules
const bot = require('../../components/bot');
const deleteOriginalAndBan = require('./shared/deleteOriginalAndBan');
//init
module.exports = function ({message, payload: [originalChatId, originalMessageId]}) {
    return Promise.all([
        bot.sendMessage(message.chat.id, `Сообщение удалено, автор лишен возможности писать сообщения.`),
        deleteOriginalAndBan({message, payload: [originalChatId, originalMessageId]}),
    ]);
};