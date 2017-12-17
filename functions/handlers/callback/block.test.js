"use strict";
jest.mock('../../components/bot.js');
jest.mock('../../components/db.js');
//libs
const assert = require('chai').assert;
//modules
const getMockData = require('../../mockData/getMockData');
const handle = require('../handle');
const bot = require('../../components/bot');
const db = require('../../components/db');
//init

describe('Block anything', () => {
    beforeEach(done => {
        bot.mockClear();
        db.mockClear();
        const mockRequest = getMockData('blockCallback');
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should delete forward message, control message and original message', () => {
        assert.strictEqual(3, bot.deleteMessage.mock.calls.length);
        const [
            [chatId1, messageId1],
            [chatId2, messageId2],
            [chatId3, messageId3],
        ] = bot.deleteMessage.mock.calls;

        assert.strictEqual(96351452, chatId1);
        assert.strictEqual(95, messageId1);

        assert.strictEqual(96351452, chatId2);
        assert.strictEqual(94, messageId2);

        assert.strictEqual(-1001245604961, chatId3);
        assert.strictEqual(10, messageId3);
    });
    it('should restrict chat member', () => {
        assert.strictEqual(1, bot.restrictChatMember.mock.calls.length);
        const [[chatId, userId, {can_send_messages}]] = bot.restrictChatMember.mock.calls;

        assert.strictEqual(-1001245604961, chatId);
        assert.strictEqual(100000, userId);
        assert.strictEqual(false, can_send_messages);
    });
    it('should send success message', () => {
        assert.strictEqual(1, bot.sendMessage.mock.calls.length);
        const [[chatId, text]] = bot.sendMessage.mock.calls;

        assert.strictEqual(96351452, chatId);
        assert.include(text, 'FNAME');
        assert.include(text, 'SNAME');
    });
});