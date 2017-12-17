"use strict";
const db = {
    addManager: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    blackListLink: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    blackListSticker: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    approveStickerPack: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    blackListDomain: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    getBlacklistedDomains: jest.fn().mockImplementation(chatId => {
        if(chatId === -100000009999){
            return Promise.resolve(['blacklisted.com'])
        }
        throw 'Unexpected chatId ' + chatId;
    }),
    getBlacklistedLinks: jest.fn().mockImplementation(chatId => {
        if(chatId === -100000009999){
            return Promise.resolve(['http://second2.org/user-agent?test=1'])
        }
        throw 'Unexpected chatId ' + chatId;
    }),
    getGroup: jest.fn().mockImplementation(() => Promise.resolve({
        managers: [12399999, 12377777],
    })),
    mockClear: () => {
        for (let key in db) {
            db[key].mockClear && db[key].mockClear()
        }
    }
};

module.exports = db;