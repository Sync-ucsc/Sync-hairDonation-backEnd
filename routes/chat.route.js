const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const  {sendResponse} = require('../utils/response.utils');
const  {messageResponse} = require('../utils/chat.utils');

const ChatService = require('../services/chat.service');
const chatService = new ChatService();


router.use(bodyParser.urlencoded({ extended: false }));

router.post('/addNewMessage', async ( req , res ) => {
    try {
        const response = await chatService.addNewMessage(req.body, req.app.get('io'));
        res.send(sendResponse(response));
    } catch (err) {
        res.status(500);
        res.send(sendResponse(undefined,false, err));
    }

});

//test routes
router.get('/ping', ( _ , res) => res.send(sendResponse('Chat Route')));

router.get('/allMessages' , async (_ , res) => {
    const allMessages = await chatService.getAll();
    res.send(sendResponse(allMessages));
});

router.post('/deleteAllMessages' , async ( _ , res) => {
    try {
        const response = await chatService.removeAll();
        res.send(sendResponse(response));
    }catch (error) {
        res.status(500);
        res.send(sendResponse(undefined, false, error));
    }
});

router.post('/deleteMessages' , async ( req , res) => {
    try {
        const response = await chatService.removeById(req.body);
        res.send(sendResponse(response));
    }catch (error) {
        res.status(500);
        res.send(sendResponse(undefined, false, error));
    }
});

router.get('/testSocket', ( req , res) => {
    const io = req.app.get('io');
    io.emit('hello');
    res.send(sendResponse('hello'));
});

router.post('/testBroadcast', (req,res) => {
    const io = req.app.get('io');
    console.log('broadcast message');
    io.on('connection', (socket) => {
        console.log('broadcast');
        socket.broadcast.emit('broadcast', messageResponse('fjs','all',`broadcast message`,undefined,undefined));
    });
    res.send(sendResponse());
});

// error routes
router.get('*' , (_ , res) => res.send(sendResponse(undefined, false, 'path not match get requests')));
router.post('*' , (_ , res) => res.send(sendResponse(undefined, false, 'path not match post requests')));

module.exports = router;
