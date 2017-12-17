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


const database = {
    addManager: ({chatId, managerId}) => {
        const docRef = db.collection('groups').doc('' + chatId);
        return docRef.get().then(doc => {
            let managers = (doc.data() || {}).managers || [];
            managers.push(managerId);
            managers = Array.from(new Set(managers));

            database.dropCache(chatId);

            return docRef.set({
                managers
            }, {merge: true});
        });
    },
    blackListDomain: ({chatId, blockedString}) => {
        const docRef = db.collection('groups').doc('' + chatId);
        return docRef.get().then(doc => {
            let blockedDomains = (doc.data() || {}).blockedDomains || [];
            blockedDomains.push(blockedString);
            blockedDomains = Array.from(new Set(blockedDomains));

            database.dropCache(chatId);

            return docRef.set({
                blockedDomains
            }, {merge: true});
        });
    },
    blackListLink: ({chatId, blockedString}) => {
        const docRef = db.collection('groups').doc('' + chatId);
        return docRef.get().then(doc => {
            let blockedLinks = (doc.data() || {}).blockedLinks || [];
            blockedLinks.push(blockedString);
            blockedLinks = Array.from(new Set(blockedLinks));

            database.dropCache(chatId);

            return docRef.set({
                blockedLinks
            }, {merge: true});
        });
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
    getBlacklistedDomains: async (chatId) => {
        const group = await database.getGroup(chatId);
        return group.blockedDomains || [];
    },
    getBlacklistedLinks: async (chatId) => {
        const group = await database.getGroup(chatId);
        return group.blockedLinks || [];
    },
};
module.exports = database;