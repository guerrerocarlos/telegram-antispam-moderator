"use strict";
//libs
//modules
//init
module.exports = function ({text, entities}, type) {
    return (entities || [])
        .filter(entity => entity.type === type)
        .map(({offset, length}) => text.substr(offset, length));
};