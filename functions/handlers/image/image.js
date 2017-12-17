"use strict";
//libs
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
//init
module.exports = async function (message) {
    if (!message) return;
    const {photo, message_id, chat} = message;

    if (!photo) return Promise.resolve(null);

    const managers = await db.getManagers(chat.id);

    const newMessageText = `Одобрите изображение или забаньте автора.`;

    const messagePromises = managers.map(async function (managerId) {
        const forwardedMessage = await bot.forwardMessage(managerId, chat.id, message_id);

        await bot.sendMessage(managerId, newMessageText, {
            reply_to_message_id: forwardedMessage.message_id,
            reply_markup: {
                inline_keyboard:
                    [
                        [
                            {
                                text: 'Одобрить',
                                callback_data: `approve_${chat.id}_${message_id}`
                            },
                            {
                                text: 'Удалить и забанить',
                                callback_data: `block_${chat.id}_${message_id}`
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