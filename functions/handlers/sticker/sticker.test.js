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

describe('New sticker', () => {
    beforeEach(done => {
        db.mockClear();
        bot.mockClear();

        const mockRequest = getMockData('sticker');
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should forward message to all managers', () => {
        assert.strictEqual(2, bot.forwardMessage.mock.calls.length);
        const [[chatId1, fromChatId1, messageId1], [chatId2, fromChatId2, messageId2]] = bot.forwardMessage.mock.calls;
        assert.strictEqual(12399999, chatId1);
        assert.strictEqual(-100000009999, fromChatId1);
        assert.strictEqual(90009, messageId1);

        assert.strictEqual(12377777, chatId2);
        assert.strictEqual(-100000009999, fromChatId2);
        assert.strictEqual(90009, messageId2);
    });
    it('should create approve link', () => {
        const [, , {reply_markup}] = bot.sendMessage.mock.calls[0];
        const approveCallback = reply_markup.inline_keyboard[0][0].callback_data;
        assert.strictEqual('approveSticker_-100000009999_90009', approveCallback);
    });
    it('should create ban link', () => {
        const [, , {reply_markup}] = bot.sendMessage.mock.calls[0];
        const approveCallback = reply_markup.inline_keyboard[0][1].callback_data;
        assert.strictEqual('blockSticker_-100000009999_90009', approveCallback);
    });
});

describe('Blacklisted sticker', () => {
    beforeEach(done => {
        db.mockClear();
        bot.mockClear();

        const mockRequest = getMockData('sticker', {
            message: {
                sticker:{
                    set_name: 'badass_stickerpack'
                }
            }
        });
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should notify all managers', () => {
        assert.strictEqual(2, bot.sendMessage.mock.calls.length);
        const [call1, call2] = bot.sendMessage.mock.calls;

        assert.strictEqual(12399999, call1[0]);
        assert.include(call1[1], 'https://telegram.me/addstickers/badass_stickerpack');
        assert.include(call1[1], 'FNAME');
        assert.include(call1[1], 'SNAME');

        assert.strictEqual(12377777, call2[0]);
        assert.include(call2[1], 'https://telegram.me/addstickers/badass_stickerpack');
        assert.include(call2[1], 'FNAME');
        assert.include(call2[1], 'SNAME');
    });
    it('should delete message', () => {
        assert.strictEqual(1, bot.deleteMessage.mock.calls.length);
        const [[chatId, messageId]] = bot.deleteMessage.mock.calls;

        assert.strictEqual(-100000009999, chatId);
        assert.strictEqual(90009, messageId);
    });
    it('should not forward message', () => {
        assert.strictEqual(0, bot.forwardMessage.mock.calls.length);
    });
    it('should restrict chat member', () => {
        assert.strictEqual(1, bot.restrictChatMember.mock.calls.length);
        const [[chatId, userId, {can_send_messages}]] = bot.restrictChatMember.mock.calls;

        assert.strictEqual(-100000009999, chatId);
        assert.strictEqual(96351452, userId);
        assert.strictEqual(false, can_send_messages);
    });
});

describe('Whitelisted sticker', () => {
    beforeEach(done => {
        db.mockClear();
        bot.mockClear();

        const mockRequest = getMockData('sticker', {
            message: {
                sticker:{
                    set_name: 'god_bless_stickerpack'
                }
            }
        });
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should not notify managers', () => {
        assert.strictEqual(0, bot.sendMessage.mock.calls.length);
    });
    it('should not delete message', () => {
        assert.strictEqual(0, bot.deleteMessage.mock.calls.length);
    });
    it('should not forward message', () => {
        assert.strictEqual(0, bot.forwardMessage.mock.calls.length);
    });
    it('should not restrict chat member', () => {
        assert.strictEqual(0, bot.restrictChatMember.mock.calls.length);
    });
});