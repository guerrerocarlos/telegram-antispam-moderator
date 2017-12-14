"use strict";
module.exports = {
    addManager: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    getGroup: jest.fn().mockImplementation(() => Promise.resolve({
        managers: [12399999, 12377777],
    })),
};