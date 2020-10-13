const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');
const {messageResponse} = require('../utils/chat.utils');

const ChatService = require('../services/chat.service');
const chatService = new ChatService();


router.use(bodyParser.urlencoded({extended: false}));

/**
 * get user messages by user id
 * userId == receiverId on Chat collection
 * @param req.params.receiverId {String} user id of message receiver
 * @return  {sendResponse} {@link sendResponse}
 */
router.get('/getMyAllMessages/:receiverId', async (req, res) => {
    try {
        const receiverId = req.params.receiverId;

        const myAllMessages = await chatService.getMyAllMessages(receiverId);

        res.send(sendResponse(myAllMessages))

    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

/**
 * get user full name and profile picture
 * @param userId user id
 */
router.get('/userDetails/:userId', async (req, res) => {
    try {

        const userId = req.params.userId;

        const userDetails = await chatService.getUserDetailById(userId);

        res.send(sendResponse(userDetails))

    }catch (error) {
        res.send(sendResponse(undefined, false,error.toString()))
    }
})

/**
 * get user full name and profile picture
 */
router.get('/getUserDetailsByRole/:role', async (req, res) => {
    try {

        const userId = req.params.userId;

        const userDetails = await chatService.getUserDetailsByRole(userId, req.params.role);

        res.send(sendResponse(userDetails))

    }catch (error) {
        res.send(sendResponse(undefined, false,error.toString()))
    }
})


/**
 * get specific chat of two parties
 * @param req.body.senderId {String} user id of message sender
 * @param req.body.receiverId {String} user id of message receiver
 * @return  {sendResponse} {@link sendResponse}
 */
router.post('/getSpecificChat', async (req, res) => {
    try{

        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;

        const myChatMessages = await chatService.getSpecificChat(senderId,receiverId);

        res.send(sendResponse(myChatMessages))

    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})
/**
 * get previous chat list
 * @param req.body.senderId {String} user id of message sender
 * @param req.body.receiverId {String} user id of message receiver
 * @return  {sendResponse} {@link sendResponse}
 */
router.post('/getMyChatList', async (req, res) => {
    try {

        const receiverId = req.body.receiverId;

        /**
         * @return {{receiverId: string, senderId: string, senderName: string, receiverName: string}}
         */
        const chatList = await chatService.getMyChatList(receiverId)

        res.send(sendResponse(chatList))

    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})


router.post('/getMyOldMessage', async (req,res) => {
    try{
        const receiverId = req.body.receiverId;
        const senderId = req.body.senderId;

        /**
         * @return {{receiverId: string, senderId: string, senderName: string, receiverName: string}}
         */
        const chatList = await chatService.getMyOldChatList(receiverId, senderId)

        res.send(sendResponse(chatList))
    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})


//test routes
router.get('/ping', (_, res) => res.send(sendResponse('Chat Route')));

router.get('/allMessages', async (_, res) => {
    const allMessages = await chatService.getAll();
    res.send(sendResponse(allMessages));
});

router.post('/deleteAllMessages', async (_, res) => {
    try {
        const response = await chatService.removeAll();
        res.send(sendResponse(response));
    } catch (error) {
        res.status(500);
        res.send(sendResponse(undefined, false, error));
    }
});

router.post('/deleteMessages', async (req, res) => {
    try {
        const response = await chatService.removeById(req.body);
        res.send(sendResponse(response));
    } catch (error) {
        res.status(500);
        res.send(sendResponse(undefined, false, error));
    }
});

router.get('/testSocket', (req, res) => {
    const io = req.app.get('io');
    io.emit('hello');
    res.send(sendResponse('hello'));
});

router.post('/testBroadcast', (req, res) => {
    const io = req.app.get('io');
    console.log('broadcast message');
    io.on('connection', (socket) => {
        console.log('broadcast');
        socket.broadcast.emit('broadcast', messageResponse('fjs', 'all', `broadcast message`, undefined, undefined));
    });
    res.send(sendResponse());
});

// error routes
router.get('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match get requests'))
});
router.post('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match post requests'))
});
router.put('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match get requests'))
});
router.delete('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match post requests'))
});
module.exports = router;
