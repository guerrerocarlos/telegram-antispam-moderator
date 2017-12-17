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

describe('New link', () => {
    beforeEach(done => {
        db.mockClear();
        bot.mockClear();

        const mockRequest = getMockData('threeLinks');
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should forward message to all managers', () => {
        assert.strictEqual(2, bot.forwardMessage.mock.calls.length);
        const [[chatId1, fromChatId1, messageId1], [chatId2, fromChatId2, messageId2]] = bot.forwardMessage.mock.calls;
        assert.strictEqual(12399999, chatId1);
        assert.strictEqual(-100000009999, fromChatId1);
        assert.strictEqual(4000, messageId1);

        assert.strictEqual(12377777, chatId2);
        assert.strictEqual(-100000009999, fromChatId2);
        assert.strictEqual(4000, messageId2);
    });
    it('should send controll message to all managers', () => {
        assert.strictEqual(2, bot.sendMessage.mock.calls.length);
        const [call1, call2] = bot.sendMessage.mock.calls;

        assert.strictEqual(12399999, call1[0]);
        assert.strictEqual(99, call1[2].reply_to_message_id);

        assert.strictEqual(12377777, call2[0]);
        assert.strictEqual(99, call2[2].reply_to_message_id);
    });
    it('should create approve link', () => {
        const [, , {reply_markup}] = bot.sendMessage.mock.calls[0];
        const approveCallback = reply_markup.inline_keyboard[0][0].callback_data;
        assert.strictEqual('approve_-100000009999_4000', approveCallback);
    });
    it('should create domain blacklist link', () => {
        const [, , {reply_markup}] = bot.sendMessage.mock.calls[0];
        const deleteCallback = reply_markup.inline_keyboard[1][0].callback_data;
        assert.strictEqual('blockDomain_-100000009999_4000', deleteCallback);
    });
    it('should create domain blacklist link', () => {
        const [, , {reply_markup}] = bot.sendMessage.mock.calls[0];
        const deleteCallback = reply_markup.inline_keyboard[1][1].callback_data;
        assert.strictEqual('blockLink_-100000009999_4000', deleteCallback);
    });
});

describe('Blacklisted link', () => {
    beforeEach(done => {
        db.mockClear();
        bot.mockClear();

        const mockRequest = getMockData('blockedLink');
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should notify all managers', () => {
        assert.strictEqual(3, bot.sendMessage.mock.calls.length);
        const [call1, call2, call3] = bot.sendMessage.mock.calls;

        assert.strictEqual(12399999, call1[0]);
        assert.include(call1[1], 'http://second2.org/user-agent?test=1');
        assert.include(call1[1], 'FNAME');
        assert.include(call1[1], 'SNAME');

        assert.strictEqual(12377777, call2[0]);
        assert.include(call2[1], 'http://second2.org/user-agent?test=1');
        assert.include(call2[1], 'FNAME');
        assert.include(call2[1], 'SNAME');

        assert.strictEqual(-100000009999, call3[0]);
    });
    it('should delete message', () => {
        assert.strictEqual(1, bot.deleteMessage.mock.calls.length);
        const [[chatId, messageId]] = bot.deleteMessage.mock.calls;

        assert.strictEqual(-100000009999, chatId);
        assert.strictEqual(75, messageId);
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
describe('Blacklisted domain', () => {
    beforeEach(done => {
        db.mockClear();
        bot.mockClear();

        const mockRequest = getMockData('blockedDomain');
        handle(mockRequest).then(() => {
            done();
        });
    });
    it('should notify all managers', () => {
        assert.strictEqual(3, bot.sendMessage.mock.calls.length);
        const [call1, call2, call3] = bot.sendMessage.mock.calls;

        assert.strictEqual(12399999, call1[0]);
        assert.include(call1[1], 'blacklisted.com/myuseragent?test=134');
        assert.include(call1[1], 'FNAME');
        assert.include(call1[1], 'SNAME');

        assert.strictEqual(12377777, call2[0]);
        assert.include(call2[1], 'blacklisted.com/myuseragent?test=134');
        assert.include(call2[1], 'FNAME');
        assert.include(call2[1], 'SNAME');

        assert.strictEqual(-100000009999, call3[0]);
    });
    it('should delete message', () => {
        assert.strictEqual(1, bot.deleteMessage.mock.calls.length);
        const [[chatId, messageId]] = bot.deleteMessage.mock.calls;

        assert.strictEqual(-100000009999, chatId);
        assert.strictEqual(12, messageId);
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