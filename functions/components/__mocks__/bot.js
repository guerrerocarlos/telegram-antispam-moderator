"use strict";
module.exports = {
    sendMessage: jest.fn().mockImplementation(() => Promise.resolve({message_id: 10})),
    forwardMessage: jest.fn().mockImplementation(() => Promise.resolve({message_id: 99})),
    deleteMessage: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    restrictChatMember: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
};