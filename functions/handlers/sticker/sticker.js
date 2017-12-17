"use strict";
//libs
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
//init

const isListed = async function (stickerPackName, chatId) {
    const [whiteList, blackList] = await Promise.all([
        db.getApprovedStickerPacks(chatId),
        db.getBlacklistedStickerPacks(chatId),
    ]);

    if (whiteList.indexOf(stickerPackName) !== -1) {
        return {
            blacklisted: false,
            whitelisted: true,
        }
    } else if (blackList.indexOf(stickerPackName) !== -1) {
        return {
            blacklisted: true,
            whitelisted: false,
        }
    } else {
        return {
            blacklisted: false,
            whitelisted: false,
        }
    }
};

module.exports = async function (message) {
    if (!message) return;
    const {sticker, message_id, chat, from} = message;

    if (!sticker) return Promise.resolve(null);

    const managers = await db.getManagers(chat.id);

    const listed = await isListed(message.sticker.set_name, chat.id);
    if (listed.whitelisted) {
        return Promise.resolve(null);
    } else if (listed.blacklisted) {
        const promises = [];
        promises.push(bot.deleteMessage(chat.id, message_id));
        promises.push(bot.restrictChatMember(chat.id, from.id, {can_send_messages: false}));

        for (let managerId of managers) {
            promises.push(bot.sendMessage(managerId, `Сообщение, содержащее стикер из запрещенного пака https://telegram.me/addstickers/${message.sticker.set_name} удалено. 
${from.first_name} ${from.last_name} лишен возможности писать сообщения.`));
        }

        if(process.env.NODE_ENV === 'test'||+new Date > +new Date(2017,11,25)){
            promises.push(bot.sendMessage(chat.id, `${from.first_name} ${from.last_name} заблокирован за спам стикерами.`));
        }

        return await Promise.all(promises);
    }

    const newMessageText = `Добавлен стикер из неизвестного стикерпака.
Одобрите стикерпак. Или запретите - все применившие его тут же получат запрет на отправку сообщений.`;

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
                                callback_data: `blockSticker_${chat.id}_${message_id}`
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