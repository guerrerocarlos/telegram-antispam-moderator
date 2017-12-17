"use strict";
//libs
//modules
const bot = require('../../components/bot');
const config = require('../../config');
//init
const TEXT = `Добрый день!
Бот помогает модерировать каналы. 
Все посты со ссылками и стикерами из черного списка удаляет, а авторам запрещает писать сообщения.
Все непроверенные ссылки, упоминания и стикеры скидывает в этот чат.
Для начала добавьте бота в группу и дайте админский доступ. Бот работает только в супергруппах.
Если что пишите https://t.me/solohin_ilya`;
const LINK = `https://telegram.me/${config.BOT_USERNAME}?startgroup=true`;

module.exports = function ({chat}) {
    return bot.sendMessage(chat.id, TEXT, {
        reply_markup: {
            inline_keyboard:
                [[
                    {
                        text: 'Добавить в группу',
                        url: LINK
                    }
                ]]
        }
    });
};