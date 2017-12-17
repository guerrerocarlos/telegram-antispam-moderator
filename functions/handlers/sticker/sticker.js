"use strict";
//libs
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
//init
module.exports = async function (message) {
    if (!message) return;
    const {sticker, message_id, chat} = message;

    if (!sticker) return Promise.resolve(null);

    const {managers} = await db.getGroup(chat.id);

    const newMessageText = `Добавлен стикер из неизвестного стикерпака.
Сообщение можно просто удалить, удалить блокировкой ссылки или всего домена.`;

    const messagePromises = managers.map(async function (managerId) {
        const forwardedMessage = await bot.forwardMessage(managerId, chat.id, message_id);

        await bot.sendMessage(managerId, newMessageText, {
            reply_to_message_id: forwardedMessage.message_id,
            reply_markup: {
                inline_keyboard:
                    [
                        [
                            {
                                text: 'Одобрить стикерпак',
                                callback_data: `approveSticker_${chat.id}_${message_id}`
                            },
                            {
                                text: 'Забанить стикерпак',
                                callback_data: `banSticker_${chat.id}_${message_id}`
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