"use strict";
//libs

//modules
const getDomain = require('../../components/getDomain');
const db = require('../../components/db');
const bot = require('../../components/bot');
const extractEnteties = require('../../components/extractEnteties');
const deleteOriginalAndBan = require('./shared/deleteOriginalAndBan');
//init
module.exports = function ({message, payload: [originalChatId, originalMessageId]}) {
    const {forward_from} = message.reply_to_message;

    originalChatId = parseInt(originalChatId);

    return Promise.all([
        bot.sendMessage(message.chat.id, `Сообщение удалено.
${forward_from.first_name} ${forward_from.last_name} лишен возможности писать сообщения.`),
        deleteOriginalAndBan({message, payload: [originalChatId, originalMessageId]}),
    ]);
};