"use strict";
module.exports = {
    sendMessage: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'}))
};