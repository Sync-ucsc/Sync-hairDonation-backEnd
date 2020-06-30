const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const md5 = require('md5');
const RETURN_URL = '';
const CANCEL_URL = '';
const NOTIFY_URL = '';
const MERCHANT_ID = '';

const  {sendResponse} = require('../utils/response.utils');

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/createPayment', ( req , res) => {

    const {
        firstName,
        lastName,
        amount,
        email,
        phoneNumber,
        address,
        city,
        country
    } = req.body;

    // hash = strtoupper (md5 ( firstName . $order_id . $payhere_amount . $payhere_currency . strtoupper(md5($payhere_secret)) ) )

    const payment = {
        "sandbox": true,
        "merchant_id": MERCHANT_ID,
        "return_url": RETURN_URL,
        "cancel_url": CANCEL_URL,
        "notify_url": NOTIFY_URL,
        "order_id": "ItemNo12345",
        "items": `Donation from ${firstName} ${lastName}`,
        "amount": amount,
        "currency": "LKR",
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "phone": phoneNumber,
        "address": address,
        "city": city,
        "country": country,
        // "delivery_address": "No. 46, Galle road, Kalutara South",
        // "delivery_city": "Kalutara",
        // "delivery_country": "Sri Lanka",
        "custom_1": "",
        "custom_2": ""
    };




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