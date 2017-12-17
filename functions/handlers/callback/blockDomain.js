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
    const {forward_from, text, entities} = message.reply_to_message;

    const [link] = extractEnteties({text, entities}, 'url');
    const domain = getDomain(link);
    originalChatId = parseInt(originalChatId);

    return Promise.all([
        bot.sendMessage(message.chat.id, `Сообщение удалено. Любой, кто оставит ссылку на ${domain} будет заблокирован.
${forward_from.first_name} ${forward_from.last_name} лишен возможности писать сообщения.`),
        deleteOriginalAndBan({message, payload: [originalChatId, originalMessageId]}),
        db.blackListDomain({chatId: originalChatId, blockedString: domain}),
    ]);
};