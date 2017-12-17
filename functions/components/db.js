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


const db = admin.firestore();


module.exports = {
    addManager: ({chatId, managerId}) => {
        const docRef = db.collection('groups').doc('' + chatId);
        return docRef.get().then(doc => {
            let managers = (doc.data() || {}).managers || [];
            managers.push(managerId);
            managers = Array.from(new Set(managers));

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

            return docRef.set({
                blockedLinks
            }, {merge: true});
        });
    },
    getGroup: async (chatId) => {
        const docRef = db.collection('groups').doc('' + chatId);
        const doc = await docRef.get();
        return (doc.data() || {});
    },
};