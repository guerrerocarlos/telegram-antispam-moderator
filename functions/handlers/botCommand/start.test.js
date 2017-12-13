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

describe('/start message from private group', () => {
    beforeAll(done => {
        bot.sendMessage.mockClear();
        const mockRequest = getMockData('personal', {
            message: {text: '/start'}
        });
        handle(mockRequest).then(() => {
            done();
        })
    });

    it('should send a message', () => {
        assert.strictEqual(1, bot.sendMessage.mock.calls.length);
    });
});

describe('/start message from super group', () => {
    beforeEach(done => {
        bot.sendMessage.mockClear();
        const mockRequest = getMockData('mention', {
            message: {text: '/start'}
        });
        handle(mockRequest).then(() => {
            done();
        })
    });

    it('should not send a message', () => {
        assert.strictEqual(0, bot.sendMessage.mock.calls.length);
    });
});