"use strict";
//libs
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
const extractEnteties = require('../../components/extractEnteties');
const config = require('../../config');
//init
module.exports = async function (message) {
    if(!message)return;
    const {entities, message_id, chat, text} = message;

    const mentions = extractEnteties({text, entities}, 'mention');
    if (mentions.length === 0) {
        return Promise.resolve(null);
    }

    const {managers} = await db.getGroup(chat.id);
    const promises = managers.map(managerId => bot.forwardMessage(managerId, chat.id, message_id));
    await Promise.all(promises);
    return true;
};