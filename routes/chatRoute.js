const express = require('express');
const router = express.Router();
const ChatService = require('../services/chat.service');

const chatService = new ChatService();



router.post('/addNewMessage', async ( req , res ) => {
    try {
        const response = await chatService.addNewMessage(req.body);
        res.send(chatService.sendResponse(response));
    } catch (err) {
        res.status(500).send(err);
    }

});

//test routes
router.get('/ping', ( _ , res) => res.send(chatService.sendResponse('Chat Route')));

router.get('/testSocket', ( req , res) => {
    const io = req.app.get('io');
    console.log(io);
    res.send(chatService.sendResponse(undefined));
});

// error routes
router.get('*' , (_ , res) => res.send(chatService.sendResponse(undefined, false, 'path not match get requests')));
router.post('*' , (_ , res) => res.send(chatService.sendResponse(undefined, false, 'path not match post requests')));

module.exports = router;
