"use strict";
//libs
//modules
const bot = require('../../components/bot');
const deleteOriginalAndBan = require('./shared/deleteOriginalAndBan');
//init
module.exports = function ({message, payload: [originalChatId, originalMessageId]}) {
    const forwardFrom = message.reply_to_message.forward_from;
    return Promise.all([
        bot.sendMessage(message.chat.id, `Сообщение удалено, ${forwardFrom.first_name} ${forwardFrom.last_name} лишен возможности писать сообщения.`),
        deleteOriginalAndBan({message, payload: [originalChatId, originalMessageId]}),
    ]);
};