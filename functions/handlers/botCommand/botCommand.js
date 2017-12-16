"use strict";
//libs
//modules
const start = require('./start');
//init
module.exports = function (message) {
    if (message && message.text === '/start' && message.chat.type === 'private') {
        return start(message);
    } else {
        return Promise.resolve(null);
    }
};