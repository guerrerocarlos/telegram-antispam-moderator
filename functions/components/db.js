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
    getGroup: async (chatId) => {
        const docRef = db.collection('groups').doc('' + chatId);
        const doc = await docRef.get();
        return (doc.data() || {});
    },
};