const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');

const NeedToDeliverService = require('../services/NeedToDeliver.service');
const needToDeliverService = new NeedToDeliverService();

router.use(bodyParser.urlencoded({extended: false}));

//adding new needtodeliver
router.put('/add/:salonEmail', async (req, res) => {
    try {
        const io = req.app.get('io');

        const salonEmail = req.params.salonEmail;

        if(!salonEmail){
           return res.send(sendResponse(undefined, false, `salon email not found`));
        }

        const response = await needToDeliverService.addNeedtodeliver(req.body, salonEmail);
        console.log(response)
        console.log(`kkk`)
        io.emit('new-wig-request');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        console.log(`response`)
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

//update wig count
router.get('/updateWigCount/:requestId/:wigcount', async (req, res) => {
    try {
        const io = req.app.get('io');

        const requestId = req.params.requestId;
        const wigcount = req.params.wigcount;

        console.log(wigcount)
        const result = await needToDeliverService.updateWigCount({wigCount:wigcount}, requestId,wigcount);

        io.emit('update-wig-request');

        res.send(sendResponse(result));
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()));
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

module.exports = router;