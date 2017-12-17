"use strict";
if (process.env.NODE_ENV === 'test') {
    throw'Запустили реальную базу в test';
}
//libs
const admin = require('firebase-admin');
const functions = require('firebase-functions');
//modules
//init
admin.initializeApp(functions.config().firebase);
const CACHE_TIME = 5 * 60 * 1000;

const db = admin.firestore();
const cache = {};

const addSomethingToGroupList = (chatId, listName, value) => {
    const docRef = db.collection('groups').doc('' + chatId);
    return docRef.get().then(doc => {
        let itemsList = (doc.data() || {})[listName] || [];
        itemsList.push(value);

        //unify
        itemsList = Array.from(new Set(itemsList));

        database.dropCache(chatId);

        const updateData = {};
        updateData[listName] = itemsList;
        return docRef.set(updateData, {merge: true});
    });
};

const getSomeGroupList = async function (chatId, listName) {
    const group = await database.getGroup(chatId);
    return group[listName] || [];
};

const database = {
    addManager: ({chatId, managerId}) => {
        return addSomethingToGroupList(chatId, 'managers', managerId);
    },
    blackListDomain: ({chatId, blockedString}) => {
        return addSomethingToGroupList(chatId, 'blockedDomains', blockedString);
    },
    blackListLink: ({chatId, blockedString}) => {
        return addSomethingToGroupList(chatId, 'blockedLinks', blockedString);
    },
    blackListSticker: ({chatId, blockedString}) => {
        return addSomethingToGroupList(chatId, 'blockedStickers', blockedString);
    },
    approveStickerPack: ({chatId, stickerPackName}) => {
        return addSomethingToGroupList(chatId, 'approvedStickerPacks', stickerPackName);
    },
    dropCache: (chatId) => {
        delete cache['getGroup_' + chatId];
    },
    getGroup: async (chatId) => {
        const cacheKey = 'getGroup_' + chatId;

        if (cache[cacheKey] && cache[cacheKey].expiration > +new Date) {
            return cache[cacheKey];
        }

        const docRef = db.collection('groups').doc('' + chatId);
        const doc = await docRef.get();
        const data = (doc.data() || {});

        cache[cacheKey] = data;
        cache[cacheKey].expiration = +new Date + CACHE_TIME;

        return data;
    },
    getBlacklistedDomains: (chatId) => getSomeGroupList('blockedDomains'),
    getBlacklistedLinks: (chatId) => getSomeGroupList('blockedLinks'),
};
module.exports = database;