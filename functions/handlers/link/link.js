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

    const messagePromises = managers.map(managerId => bot.forwardMessage(managerId, chat.id, message_id));

    const messageText = `В собщении содержится ссылка [${link}](${link}).
Сообщение можно просто удалить, удалить блокировкой ссылки или всего домена.
На автора можно повесить запрет сообщений или запрет на ссылки, стикеры, картинки и документы в сообщениях.`;

    const controlPromises = managers.map(managerId => bot.sendMessage(managerId, messageText, {
        reply_markup: {
            inline_keyboard:
                [
                    [
                        {
                            text: 'Все ок',
                            callback_data: `approve_${chat.id}_${message_id}`
                        },
                        {
                            text: 'Только удалить',
                            url: 'http://google.com'
                        },
                    ],
                    [

                        {
                            text: 'Домен в blacklist ' + domain,
                            url: 'http://google.com'
                        },
                        {
                            text: 'Ссылку в blacklist',
                            url: 'http://google.com'
                        },
                    ],
                    [

                        {
                            text: 'Бан автора',
                            url: 'http://google.com'
                        },
                        {
                            text: 'Запрет автору ссылки и медиа',
                            url: 'http://google.com'
                        },
                    ],
                ]
        },
        parse_mode: 'Markdown'
    }));
    await Promise.all([...controlPromises, ...messagePromises]);

    return true;
};