"use strict";
//libs
//modules
//init

const handlerNames = ['botCommand', 'addToChat', 'link', 'mention', 'sticker','image'];

const handlers = handlerNames.map(name => require(`./${name}/${name}`));

module.exports = function ({message}) {
    const promises = handlers.map(handler => handler(message));
    return Promise.all(promises).then(results => {
        return results.filter(result => result !== null)[0] || null;
    })
};