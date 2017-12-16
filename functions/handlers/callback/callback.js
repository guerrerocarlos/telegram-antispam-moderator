"use strict";
//libs
//modules
//init
module.exports = function (message, callback_query) {
    if (!callback_query) return;
    const [method, ...payload] = callback_query.data.split('_');
    return require('./' + method)({
        message: callback_query.message,
        payload
    });
};