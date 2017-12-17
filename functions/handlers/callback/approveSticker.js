"use strict";
//libs
//modules
const deleteControlMessages = require('./shared/deleteControlMessages');
const db = require('../../components/db');
//init
module.exports = function ({message, payload: [chatId, messageId]}) {
    return Promise.all([
        deleteControlMessages({message, payload: [chatId, messageId]}),
        db.approveStickerPack({stickerPackName: message.reply_to_message.sticker.set_name, chatId}),
    ])
};