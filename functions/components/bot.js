"use strict";
//libs
const TelegramBot = require('node-telegram-bot-api');
//modules
const config = require('../config');
//init

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN);

module.exports = bot;