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

describe('Approve', () => {
    beforeEach(done => {
        bot.mockClear();
        db.mockClear();

        const mockRequest = getMockData('approveStickerCallback');
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should delete forward message and control message', () => {
        assert.strictEqual(2, bot.deleteMessage.mock.calls.length);
        const [[chatId1, messageId1], [chatId2, messageId2]] = bot.deleteMessage.mock.calls;

        assert.strictEqual(96351452, chatId1);
        assert.strictEqual(132, messageId1);

        assert.strictEqual(96351452, chatId2);
        assert.strictEqual(131, messageId2);
    });

    it('should add sticker pack to whitelist', () => {
        assert.strictEqual(1, db.approveStickerPack.mock.calls.length);
        const [[{stickerPackName, chatId}]] = db.approveStickerPack.mock.calls;

        assert.strictEqual('ituber', stickerPackName);
        assert.strictEqual('-1001245604961', chatId);
    });
});