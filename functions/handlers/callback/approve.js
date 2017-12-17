"use strict";
//libs
//modules
const deleteControlMessages = require('./shared/deleteControlMessages');
//init
module.exports = function ({message, payload: [chatId, messageId]}) {
    return deleteControlMessages({message, payload: [chatId, messageId]});
};