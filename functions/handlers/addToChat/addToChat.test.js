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

describe('Add me', () => {
    beforeEach(done => {
        db.addManager.mockClear();
        bot.sendMessage.mockClear();
        const mockRequest = getMockData('addToGroup');
        handle(mockRequest).then(() => {
            done();
        })
    });
    it('should send message to from.id', () => {
        assert.strictEqual(1, bot.sendMessage.mock.calls.length);
        const [chatId, text, options] = bot.sendMessage.mock.calls[0]
        assert.strictEqual(9887777777, chatId);
    });
    it('should add from.id as moderator', () => {
        assert.strictEqual(1, db.addManager.mock.calls.length);
        const {chatId, managerId} = db.addManager.mock.calls[0][0];
        assert.strictEqual(-1001111199999, chatId);
        assert.strictEqual(9887777777, managerId);
    });
});
describe('Add other person', () => {
    beforeEach(done => {
        db.addManager.mockClear();
        bot.sendMessage.mockClear();
        const mockRequest = getMockData('addToGroup', {
            message: {
                new_chat_member: {
                    username: 'random_username'
                }
            }
        });
        handle(mockRequest).then(() => {
            done();
        })
    });
    it('should not send message', () => {
        assert.strictEqual(0, bot.sendMessage.mock.calls.length);
    });
    it('should not add from.id as moderator', () => {
        assert.strictEqual(0, db.addManager.mock.calls.length);
    });
});