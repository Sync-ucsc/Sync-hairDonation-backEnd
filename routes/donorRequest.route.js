const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');

const DonorRequestService = require('../services/donorRequest.service');
const donorRequestService = new DonorRequestService();

router.use(bodyParser.urlencoded({extended: false}));

//Cancel donorrequest
router.get('/cancelDonorrequest/:requestId', async (req, res) => {
    try {
        const io = req.app.get('io');

        const requestId = req.params.requestId;
        const result = await donorRequestService.updateDonorRequestStatus({canceled: true}, requestId);

        io.emit('update-donor-request');

        res.send(sendResponse(result));
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

//Finish donor request
router.get('/finishDonorrequest/:requestId', async (req, res) => {
    console.log("hvsh");
    try {
        const io = req.app.get('io');
        const requestId = req.params.requestId;
        const result = await donorRequestService.updateDonorRequestStatus({finished: true}, requestId);

        io.emit('update-donor-request');

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