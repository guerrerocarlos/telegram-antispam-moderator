"use strict";
//libs
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
//init
module.exports = async function ({sticker, message_id, chat}) {
    if (!sticker) return Promise.resolve(null);

    const {managers} = await db.getGroup(chat.id);
    const promises = managers.map(managerId => bot.forwardMessage(managerId, chat.id, message_id));
    await Promise.all(promises);
    return true;
};