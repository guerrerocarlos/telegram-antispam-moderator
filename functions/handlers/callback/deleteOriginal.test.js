"use strict";
jest.mock('../../components/bot.js');
jest.mock('../../components/db.js');
//libs
const assert = require('chai').assert;
//modules
const getMockData = require('../../mockData/getMockData');
const handle = require('../handle');
const bot = require('../../components/bot');
//init

describe('Delete', () => {
    beforeEach(done => {
        bot.forwardMessage.mockClear();
        bot.sendMessage.mockClear();

        const mockRequest = getMockData('deleteOriginalCallback');
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
});