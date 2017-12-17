"use strict";
jest.mock('../../components/bot.js');
jest.mock('../../components/db.js');
//libs
const assert = require('chai').assert;
//modules
const getMockData = require('../../mockData/getMockData');
const handle = require('../handle');
const config = require('../../config');
const bot = require('../../components/bot');
const db = require('../../components/db');
//init

describe('New mention', () => {
    beforeEach(done => {
        db.addManager.mockClear();
        bot.forwardMessage.mockClear();
        bot.sendMessage.mockClear();

        const mockRequest = getMockData('sticker');
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should forward message to all managers', () => {
        assert.strictEqual(2, bot.forwardMessage.mock.calls.length);
        const [[chatId1, fromChatId1, messageId1], [chatId2, fromChatId2, messageId2]] = bot.forwardMessage.mock.calls;
        assert.strictEqual(12399999, chatId1);
        assert.strictEqual(-8000000089, fromChatId1);
        assert.strictEqual(90009, messageId1);

        assert.strictEqual(12377777, chatId2);
        assert.strictEqual(-8000000089, fromChatId2);
        assert.strictEqual(90009, messageId2);
    });
    it('should create approve link', () => {
        const [, , {reply_markup}] = bot.sendMessage.mock.calls[0];
        const approveCallback = reply_markup.inline_keyboard[0][0].callback_data;
        assert.strictEqual('approveSticker_-8000000089_90009', approveCallback);
    });
    it('should create ban link', () => {
        const [, , {reply_markup}] = bot.sendMessage.mock.calls[0];
        const approveCallback = reply_markup.inline_keyboard[0][1].callback_data;
        assert.strictEqual('blockSticker_-8000000089_90009', approveCallback);
    });
});