const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const  {sendResponse} = require('../utils/response.utils');

const GetInTouch = require('../services/getInTouch.service');
const getInTouch = new GetInTouch();


router.use(bodyParser.urlencoded({ extended: false }));

router.post('/add', async ( req , res ) => {
    try {
        const io = req.app.get('io');
        const response = await getInTouch.addOne(req.body);
        io.emit('new-contact-us');
        res.send(sendResponse(response));
    } catch (err) {
        res.status(500);
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
        res.status(500);
        res.send(sendResponse(undefined,false, err));
    }
});

router.post('/deleteOne' , async ( req , res) => {
    try {
        const io = req.app.get('io');
        const response = await getInTouch.removeById(req.body);
        io.emit('delete-contact-us');
        console.log('delete one');
        res.send(sendResponse(response));
    }catch (error) {
        res.status(500);
        res.send(sendResponse(undefined, false, error));
    }
});

//test routes
router.get('/ping', ( _ , res) => res.send(sendResponse('get in touch Route')));

router.post('/deleteAll' , async ( _ , res) => {
    try {
        res.send(sendResponse(await getInTouch.removeAll()));
    }catch (error) {
        res.status(500);
        res.send(sendResponse(undefined, false, error));
    }
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