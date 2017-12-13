"use strict";
//libs
const deepmerge = require('deepmerge');
const fs = require('fs');
const path = require('path');
//modules
//init
module.exports = function (templateName, changes = {}) {
    var templateRaw = fs.readFileSync(path.join(__dirname, './') + `/${templateName}.json`, 'utf8');
    let template = JSON.parse(templateRaw);

    return deepmerge(template, changes);
};