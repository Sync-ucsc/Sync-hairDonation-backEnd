const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');

const SmsService = require('../services/sms.service');
const smsService = new SmsService();

router.use(bodyParser.urlencoded({extended: false}));



router.put('/sendSms/:phoneNumber', async (req, res) => {
    try {
        const phoneNumber = req.params.phoneNumber;
        const message = req.body.message || undefined;

        const result = await smsService.sendMessage( message , phoneNumber);
        console.log(result)
        return res.send(sendResponse(result))
    }catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error))
    }
});


//test routes
router.get('/ping', (_, res) => res.send(sendResponse('sms Route')));

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

module.exports = router;
