"use strict";
//libs
//modules
//init

const handlerNames = ['botCommand', 'addToChat', 'link', 'mention', 'sticker', 'image', 'callback'];

const handlers = handlerNames.map(name => require(`./${name}/${name}`));

module.exports = function ({message, callback_query}) {
    const promises = handlers.map(handler => handler(message, callback_query));
    return Promise.all(promises).then(results => {
        return results.filter(result => result !== null)[0] || null;
    })
};