"use strict";
//libs

//modules
const db = require('../../components/db');
const bot = require('../../components/bot');
const deleteOriginalAndBan = require('./shared/deleteOriginalAndBan');
//init
module.exports = function ({message, payload: [originalChatId, originalMessageId]}) {
    const {forward_from, text, entities} = message.reply_to_message;

    originalChatId = parseInt(originalChatId);

    const stickerpack = message.reply_to_message.sticker.set_name;

    return Promise.all([
        bot.sendMessage(message.chat.id, `Сообщение удалено. Любой, кто будет использовать стикерпак ${stickerpack}, будет заблокирован.
${forward_from.first_name} ${forward_from.last_name} лишен возможности писать сообщения.`),
        deleteOriginalAndBan({message, payload: [originalChatId, originalMessageId]}),
        db.blackListSticker({chatId: originalChatId, blockedString: stickerpack}),
    ]);
};