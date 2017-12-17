"use strict";
//libs
const parseLink = require('parse-link');
//modules
//init
module.exports = function (url) {
    if(!url)return '';
    if(url.indexOf('http') !== 0){
        url = 'http://'+url;
    }
    return parseLink(url).hostname;
};