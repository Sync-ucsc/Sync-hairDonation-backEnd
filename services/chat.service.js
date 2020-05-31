const chat = require('../models/chatModel');

module.exports = class chatService {

    constructor() {

    }

    sendResponse(data = '',success = true, message = 'success'){
        return {data, success, message };
    }

    async addNewMessage(data) {
        try {
            const message = new chat(data);
            await message.save();
        } catch (error) {
            throw error;
        }
    }

    // for testing
    async getAll() {
        try {
            return  await chat.find()
        } catch (error) {
            throw error;
        }
    }

    async removeAll() {
        try {
            return  await chat.removeAll();
        } catch (error) {
            throw error;
        }
    }

};
