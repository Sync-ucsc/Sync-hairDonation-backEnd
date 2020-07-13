const chatModel= require('../models/chat.model');
const  {messageResponse} = require('../utils/chat.utils');

module.exports = class ChatService {

    constructor() {

    }

    /**
     * newUserConnect to backend this function is call
     * @param io
     */
    checkConnection(io){

        io.on('connection', socket => {
            this.messageSender(socket)
        });
    }

    /**
     * join to chat room when user connect and leave when user disconnect
     * @param socket socket connection
     */
    messageSender(socket){
        // get chat room id
        let previousChatRoomId;

        console.log(`here1`)
        console.log(previousChatRoomId)
        console.log(`here2`)


        const safeJoin = currentChatRoomId => {
            console.log('join to + ' + currentChatRoomId)
            socket.leave(previousChatRoomId);
            socket.join(currentChatRoomId);
            previousChatRoomId = currentChatRoomId;
        };

        // when user disconnect
        socket.on('disconnect', () => {
            socket.leave(previousChatRoomId)
        })

        //when user need to connect to chat room
        socket.on('join_to_room', roomId => {
            console.log('need ')
        })
        // send message
        socket.on('send_message', message => {

            // chat ids of two parties
            const receiverID = message.receiverID
            const senderID = message.senderID
            // message content
            const content = message.content

            safeJoin(receiverID);

            // message object send to user
            const messageObject = {
                'content': content,
                'senderID': senderID,
                'receiverID':receiverID,
            }

            console.log(`here1 messageObject`)
            console.log(messageObject)
            console.log(`here2 messageObject`)

            // socket.emit('receive_message', messageObject)

            // send message to receiver
            console.log(`send to + ${receiverID}`)
            socket.in(receiverID).emit('receive_message',  messageObject)
        })
    }



    /**
     * add new chat message to database
     * @param data
     * @param io
     * @return {Promise<any>}
     */
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

};
