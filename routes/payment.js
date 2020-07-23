const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const md5 = require('md5');

const  {sendResponse} = require('../utils/response.utils');

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/createPayment', ( req , res) => {


    res.send(sendResponse('payment route'));

});


router.get('/testPayment', ( req , res) => {res.send(sendResponse('payment route'));});

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
