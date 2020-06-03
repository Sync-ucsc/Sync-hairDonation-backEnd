const chat = require('../models/chatModel');

module.exports = class chatService {

    constructor() {

    }

    sendResponse = (data = '', success = true, debugMessage = 'success') => {
        return {data, success, debugMessage}
    };

    async addNewMessage(data, io) {
        try {
            const message = new chat(data);
            io.emit('newMessageAdd');
            return await message.save();
        } catch (error) {
            throw error;
        }
    }

    // for testing
    async getAll() {
        try {
            return await chat.find();
        } catch (error) {
            throw error;
        }
    }

    async removeById({id}) {
        try {
            return await chat.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }


    async removeAll() {
        try {
            return await chat.remove({});
        } catch (error) {
            throw error;
        }
    }

};
