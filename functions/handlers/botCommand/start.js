"use strict";
//libs
//modules
const bot = require('../../components/bot');
const config = require('../../config');
//init
const TEXT = `Привет!
Я помогаю модерировать каналы. 
Все посты со ссылками и стикерами из черного списка я удаляю, а авторам запрещаю писать сообщения.
Все непроверенные ссылки, упоминания и стикеры я скидываю в этот чат.
Если что пиши https://t.me/solohin_ilya`;
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