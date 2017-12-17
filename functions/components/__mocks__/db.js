"use strict";
const db = {
    addManager: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    blackListDomain: jest.fn().mockImplementation(() => Promise.resolve({some: 'data'})),
    getGroup: jest.fn().mockImplementation(() => Promise.resolve({
        managers: [12399999, 12377777],
    })),
    mockClear: () => {
        for (let key in db) {
            db[key].mockClear && db[key].mockClear()
        }
    }
};

module.exports = db;