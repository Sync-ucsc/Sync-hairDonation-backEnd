const chatModel = require('../models/chat.model');
const userModel = require('../models/user')
const {messageResponse} = require('../utils/chat.utils');

const SharedService = require('../services/shared.service');
const sharedService = new SharedService();


module.exports = class ChatService {

    constructor() {

    }

    /**
     * newUserConnect to backend this function is call
     * @param io
     */
    checkConnection(io) {
        io.on('connection', socket => {
            this.messageSender(socket)
        });
    }

    /**
     * join to chat room when user connect and leave when user disconnect
     * @param socket socket connection
     */
    messageSender(socket) {

        // store previous chat room id
        let previousChatRoomId;

        /**
         * leave from previous chat room and join to new chat room
         * @param currentChatRoomId new chat room id
         */
        const safeJoin = currentChatRoomId => {
            socket.leave(previousChatRoomId);
            socket.join(currentChatRoomId);
            previousChatRoomId = currentChatRoomId;
        };

        // when user disconnect leave from chat room
        socket.on('disconnect', () => {
            console.log("here disconnect");
            socket.leave(previousChatRoomId)
        })

        //  when user need to connect to chat room
        socket.on('join_to_room', data => {
            console.log(`here join_to_room`);
            console.log(data);
            safeJoin(data.roomId)
        })

        // send message
        socket.on('send_message', message => {
            // chat id of receiver
            const receiverId = message.receiverId
            const senderId = message.senderId
            // add message to database
            this.addNewMessage(message)
                .then(() => console.log(`add message to db`))
                .catch(error => console.log(error))

            // send message to receiver chat room
            socket.in(receiverId).emit('receive_message', message)
            socket.in(senderId).emit('receive_message', message)
        })
    }


    /**
     * add new chat message to database
     * @param data message object
     * @return {Promise<*>}
     */
    async addNewMessage(data) {
        try {
            const message = new chatModel(data);
            return await message.save();
        } catch (error) {
            throw error;
        }
    }

    /**
     * get all message by user
     * @param receiverId <string> receiver id equals to user id of a receiver
     * @return {Promise<*>}
     */
    async getMyAllMessages(receiverId) {
        try {
            return await chatModel.find({receiverId: receiverId})
        } catch (error) {
            throw error
        }
    }

    /**
     * get specific chat of two users
     * @param receiverId <string> receiver id equals to user id of a receiver
     * @param senderId <string> senderId id equals to user id of a sender
     * @return {Promise<*>}
     */
    async getSpecificChat(senderId, receiverId) {
        try {
            return await chatModel.find({
                receiverId: receiverId,
                senderId: senderId
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * get list of users on chat room
     * @param io
     * @param roomId
     * @return {*}
     */
    isOnRoom(io, roomId){
        return io.sockets.adapter.rooms[roomId]
    }

    /**
     * get previous chat user list
     * @param receiverId user id of message receiver
     * @return {Promise} send previous chat list or if error throw error
     */
    async getMyChatList(receiverId) {
        try {

            // get all received messages of receiver
            const myRawChatList = await chatModel.find({receiverId: receiverId});

            // get user detail of receiver
            const userDetails = await userModel.find({_id: receiverId});

            // full name of a receiver
            const userNameOfReceiver = sharedService.getFullUserName(userDetails);

            // only contain unique senders
            const myFilteredChatList = [];

            //filter out duplicate sender id
            myRawChatList.forEach(result => {
                // if previously not found senderId then object will push to myFilteredChatList
                if (myRawChatList.map(d => d.senderId).indexOf(result.senderId) === -1) {
                    myFilteredChatList.push({
                        senderId: result.senderId,
                        receiverName: userNameOfReceiver,
                        receiverId: result.receiverId,
                    })
                }
            })

            //find user names of senders
            const promises = myFilteredChatList.map(chatDetails => {
                return userModel.find({_id: chatDetails.senderId})
                    .then(user => sharedService.getFullUserName(user))
            });

            // resolve all mongoose promises
            const userNames = await Promise.all(promises);

            // add senderName to filtered chat list if userName not found then username set to anonymous
            return myFilteredChatList.map((currentChat, index) => {
                return {
                    ...currentChat,
                    senderName: userNames[index] || 'anonymous',
                }
            })

        } catch (error) {
            throw error
        }
    }

    /**
     * get user fullName and user profile pic
     * @param userId
     * @return {Promise<{fullName: string, dp}>}
     */
    async getUserDetail(userId){
        try {
            return await userModel.findOne({_id: userId})
                .then( user => {
                    return {
                        fullName: sharedService.getFullUserName(user),
                        dp: user.profilePic
                    }
                })

        }catch (error) {
            throw error
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
