const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const  {sendResponse} = require('../utils/response.utils');
const  {messageResponse} = require('../utils/chat.utils');

const GetInTouch = require('../services/getInTouch.service');
const getInTouch = new GetInTouch();


router.use(bodyParser.urlencoded({ extended: false }));

router.post('/add', async ( req , res ) => {
    try {
        const response = await getInTouch.addOne(req.body);
        res.send(sendResponse(response));
    } catch (err) {
        res.send(sendResponse(undefined,false, err));
    }
});

router.get('/all' , async (_ , res) => {
    res.send(sendResponse(await getInTouch.getAll()));
});

router.post('/getById' , async (req , res) => {
    try {
        const response = await getInTouch.getOne(req.body);
        res.send(sendResponse(response));
    } catch (err) {
        res.send(sendResponse(undefined,false, err));
    }
});

//test routes
router.get('/ping', ( _ , res) => res.send(sendResponse('get in touch Route')));



router.post('/deleteAll' , async ( _ , res) => {
    try {
        res.send(sendResponse(await getInTouch.removeAll()));
    }catch (error) {
        res.send(sendResponse(undefined, false, error));
    }
});

router.post('/deleteOne' , async ( req , res) => {
    try {
        const response = await getInTouch.removeById(req.body);
        res.send(sendResponse(response));
    }catch (error) {
        res.send(sendResponse(undefined, false, error));
    }
});

// error routes
router.get('*' , (_ , res) => res.send(sendResponse(undefined, false, 'path not match get requests')));
router.post('*' , (_ , res) => res.send(sendResponse(undefined, false, 'path not match post requests')));

module.exports = router;
