const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const md5 = require('md5');

const  {sendResponse} = require('../utils/response.utils');
const  PaymentService = require('../services/payment.service')
const paymentService = new PaymentService()

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/createPayment', async ( req , res) => {

        try{
            const data = await paymentService.addNewDonationToDb(req.body);

            res.send(sendResponse(data))
        }catch (error){
            res.send(sendResponse(undefined,false,error.toString()))
        }

    res.send(sendResponse('payment route'));

});

router.get('/totalPayment', async (req, res) => {
    try{
        const data = (await paymentService.getAllRequest()).length;
        res.send(sendResponse(data))
    }catch (error){
        res.send(sendResponse(undefined,false,error.toString()))
    }
})

router.get('/monthlyPayment', async (req, res) => {
    try{
        const data = (await paymentService.getAllRequest());
        res.send(sendResponse(data))
    }catch (error){
        res.send(sendResponse(undefined,false,error.toString()))
    }
})




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
