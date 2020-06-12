const chatModel= require('../models/chat.model');
const  {messageResponse} = require('../utils/chat.utils');

module.exports = class chatService {

    constructor() {

    }

    checkConnection(io){
        io.on('connection', socket => {
            console.log('new user connected');
            socket.on('disconnected', () => {console.log('user was disconnected')})

        })
    }

    async addNewMessage(data, io) {
        try {
            const message = new chatModel(data);
            io.emit('newMessageAdd');
            return await message.save();
        } catch (error) {
            throw error;
        }
    }



    // for testing
    async getAll() {
        try {
            return await chatModel.find();
        } catch (error) {
            throw error;
        }
    }

    async removeById({id}) {
        try {
            return await chatModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }


    async removeAll() {
        try {
            return await chatModel.remove({});
        } catch (error) {
            throw error;
        }
    }

    BroadCastMessage(io,{message ,id} ){

    }
};
