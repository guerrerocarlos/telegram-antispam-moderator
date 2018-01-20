"use strict";
//libs
//modules
const bot = require('../../../components/bot');
const deleteControlMessages = require('./deleteControlMessages');
//init
module.exports = function ({message, payload: [originalChatId, originalMessageId]}) {
    const forwardFrom = message.reply_to_message.forward_from;
    originalChatId = parseInt(originalChatId);
    originalMessageId = parseInt(originalMessageId);

    const banPromise = forwardFrom
        ?bot.restrictChatMember(originalChatId, forwardFrom.id, {can_send_messages: false})
        :Promise.resolve();

    return Promise.all([
        deleteControlMessages({message, payload: [originalChatId, originalMessageId]}),
        bot.deleteMessage(originalChatId, originalMessageId),
        banPromise,
    ]);
};