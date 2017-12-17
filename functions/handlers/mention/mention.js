"use strict";
//libs
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
const extractEnteties = require('../../components/extractEnteties');
const config = require('../../config');
//init
module.exports = async function (message) {
    return Promise.resolve(null);
    //TODO вернуть
    if(!message)return;
    const {entities, message_id, chat, text} = message;

    const mentions = extractEnteties({text, entities}, 'mention');
    if (mentions.length === 0) {
        return Promise.resolve(null);
    }

    const managers = await db.getManagers(chat.id);

    const newMessageText = `Упоминание неизвестного ресурса ${mentions[0]}.
Одобрите этот ресурс или запретите его упоминать.`;

    const messagePromises = managers.map(async function (managerId) {
        const forwardedMessage = await bot.forwardMessage(managerId, chat.id, message_id);

        await bot.sendMessage(managerId, newMessageText, {
            reply_to_message_id: forwardedMessage.message_id,
            reply_markup: {
                inline_keyboard:
                    [
                        [
                            {
                                text: `Одобрить ${mentions[0]}`,
                                callback_data: `approveMention_${chat.id}_${message_id}`
                            },
                            {
                                text: `Запретить ${mentions[0]}`,
                                callback_data: `blockMention_${chat.id}_${message_id}`
                            },
                        ]
                    ]
            },
            parse_mode: 'Markdown'
        });
    });
    await messagePromises;

    return true;
};