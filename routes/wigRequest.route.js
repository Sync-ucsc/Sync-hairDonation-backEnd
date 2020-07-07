const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');

const WigRequestService = require('../services/wigRequest.service');
const wigRequestService = new WigRequestService();

router.use(bodyParser.urlencoded({extended: false}));

router.put('/add/:patientEmail', async (req, res) => {
    try {
        const io = req.app.get('io');

        const patientEmail = req.params.patientEmail;

        if(!patientEmail){
           return res.send(sendResponse(undefined, false, `Patient email not found`));
        }

        const response = await wigRequestService.addWigRequest(req.body, patientEmail);
        console.log(response)
        console.log(`response`)
        io.emit('new-wig-request');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        console.log(`response`)
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

router.get('/lastRequestStatus/:patientEmail', async (req, res) => {
    try {

        const patientEmail = req.params.patientEmail;
        const lastRequest = await wigRequestService.getLastRequestData(patientEmail);

        res.send(sendResponse(lastRequest));

    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }

})

router.get('/cancelRequest/:requestId', async (req, res) => {
    try {
        const io = req.app.get('io');

        const requestId = req.params.requestId;
        const result = await wigRequestService.updateWigRequestStatus({canceled: true}, requestId);

        io.emit('update-wig-request');

        res.send(sendResponse(result));
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

router.get('/finishRequest/:requestId', async (req, res) => {
    try {
        const io = req.app.get('io');

        const requestId = req.params.requestId;
        const result = await wigRequestService.updateWigRequestStatus({finished: true}, requestId);

        io.emit('update-wig-request');

        res.send(sendResponse(result));
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

//Attendent accept wig request
router.get('/acceptWigrequest/:requestId', async (req, res) => {
    try {
        const io = req.app.get('io');
        console.log("uhfjbfj")
        const requestId = req.params.requestId;
        const result = await wigRequestService.updateWigRequestStatus({attendantStatus: 1}, requestId);

        io.emit('accept-wig-request');

        res.send(sendResponse(result));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

//Attendent decline wig request
router.get('/declineWigrequest/:requestId', async (req, res) => {
    try {
        const io = req.app.get('io');

        const requestId = req.params.requestId;
        const result = await wigRequestService.updateWigRequestStatus({attendantStatus: 2}, requestId);

        io.emit('decline-wig-request');

        res.send(sendResponse(result));
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()));
    }
});


router.get('/allPatient', async (_, res) => {
    res.send(sendResponse(await wigRequestService.getAllPatients()));
});

//test routes
router.get('/ping', (_, res) => res.send(sendResponse('wigRequest Route')));

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
