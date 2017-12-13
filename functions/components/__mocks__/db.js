"use strict";
module.exports = {
    addManager: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'}))
};