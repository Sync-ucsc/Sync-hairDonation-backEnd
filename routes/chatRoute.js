const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const ChatService = require('../services/chat.service');
const chatService = new ChatService();
io.on('connection', socket => console.log('A new user connected'))


router.use(bodyParser.urlencoded({ extended: false }));

router.post('/addNewMessage', async ( req , res ) => {
    try {
        const response = await chatService.addNewMessage(req.body, req.app.get('io'));
        res.send(chatService.sendResponse(response));
    } catch (err) {
        res.send(chatService.sendResponse(undefined,false, err));
    }

});

//test routes
router.get('/ping', ( _ , res) => res.send(chatService.sendResponse('Chat Route')));

router.get('/allMessages' , async (_ , res) => {
    const allMessages = await chatService.getAll();
    res.send(chatService.sendResponse(allMessages));
});

router.post('/deleteAllMessages' , async ( _ , res) => {
    try {
        const response = await chatService.removeAll();
        res.send(chatService.sendResponse(response));
    }catch (error) {
        res.send(chatService.sendResponse(undefined, false, error));
    }
});

router.post('/deleteMessages' , async ( req , res) => {
    try {
        const response = await chatService.removeById(req.body);
        res.send(chatService.sendResponse(response));
    }catch (error) {
        res.send(chatService.sendResponse(undefined, false, error));
    }
});

router.get('/testSocket', ( req , res) => {
    const io = req.app.get('io');
    console.log(io);
    res.send(chatService.sendResponse(undefined));
});

// error routes
router.get('*' , (_ , res) => res.send(chatService.sendResponse(undefined, false, 'path not match get requests')));
router.post('*' , (_ , res) => res.send(chatService.sendResponse(undefined, false, 'path not match post requests')));

module.exports = router;
