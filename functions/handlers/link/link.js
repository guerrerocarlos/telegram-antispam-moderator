"use strict";
//libs
const parseLink = require('parse-link');
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
const extractEnteties = require('../../components/extractEnteties');
//init
module.exports = async function (message) {
    if (!message) return;
    const {entities, message_id, chat, text} = message;

    const links = extractEnteties({text, entities}, 'url');
    if (links.length === 0) {
        return Promise.resolve(null);
    }

    const [link] = links;
    const domain = parseLink(link).hostname;
    const {managers} = await db.getGroup(chat.id);

    const newMessageText = `В собщении содержится ссылка [${link}](${link}).
Сообщение можно просто удалить, удалить блокировкой ссылки или всего домена.
Автор будет забанен.`;

    const messagePromises = managers.map(async function (managerId) {
        const forwardedMessage = await bot.forwardMessage(managerId, chat.id, message_id);

        await bot.sendMessage(managerId, newMessageText, {
            reply_to_message_id: forwardedMessage.message_id,
            reply_markup: {
                inline_keyboard:
                    [
                        [
                            {
                                text: 'Не спам',
                                callback_data: `approve_${chat.id}_${message_id}`
                            },
                            {
                                text: 'Бан+Удалить сообщение',
                                callback_data: `deleteOriginal_${chat.id}_${message_id}`
                            },
                        ],
                        [
                            {
                                text: 'Бан+Домен в blacklist ' + domain,
                                url: 'http://google.com'
                            },
                            {
                                text: 'Бан+Ссылку в blacklist',
                                url: 'http://google.com'
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