const handle = require('./handlers/handle');
const functions = require('firebase-functions');

exports.onMessage = functions.https.onRequest((request, response) => {
    return handle(request.body).then(data => {
        response.send(data);
    }).catch(e => {
        console.error();
        response.send(e);
        return Promise.reject(e);
    });
});
