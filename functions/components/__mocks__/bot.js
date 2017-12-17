"use strict";
const bot = {
    sendMessage: jest.fn().mockImplementation(() => Promise.resolve({message_id: 10})),
    forwardMessage: jest.fn().mockImplementation(() => Promise.resolve({message_id: 99})),
    deleteMessage: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    restrictChatMember: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    mockClear: ()=>{
        for (let key in bot){
            bot[key].mockClear&&bot[key].mockClear()
        }
    }
};
module.exports = bot;