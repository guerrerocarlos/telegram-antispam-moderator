"use strict";
//libs
//modules
const bot = require('../../components/bot');
//init
module.exports = function ({message, payload: [originalChatId, originalMessageId]}) {
    const forwardFrom = message.reply_to_message.forward_from;
    originalChatId = parseInt(originalChatId);
    originalMessageId = parseInt(originalMessageId);

    return Promise.all([
        bot.deleteMessage(message.chat.id, message.message_id),
        bot.deleteMessage(message.chat.id, message.reply_to_message.message_id),
        bot.deleteMessage(originalChatId, originalMessageId),
        bot.restrictChatMember(originalChatId, forwardFrom.id, {can_send_messages: false}),
        bot.sendMessage(message.chat.id, `Сообщение удалено, ${forwardFrom.first_name} ${forwardFrom.last_name} лишен возможности писать сообщения.`),
    ]);
};