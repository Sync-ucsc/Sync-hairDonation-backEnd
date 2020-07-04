const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');

const targetsService = require('../services/targets.service');
const TargetsService = new targetsService();

router.use(bodyParser.urlencoded({extended: false}));

router.post('/addTargetToDriver', async (req, res) => {
    try {
        const io = req.app.get('io');
        const response = await TargetsService.addTargetToDriver(req.body);
        io.emit('new-target');
        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
});


router.put('/addNewTargetToDriver/:driverEmail', async (req, res) => {
    try {
        const io = req.app.get('io');

        const locationData = req.body;
        const driverEmail = req.params.driverEmail
        const response = await TargetsService.addNewTargetToDriver(locationData, driverEmail);

        io.emit('update-target');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

router.put('/changeLocationStatus/:requestId', async (req, res) => {
    try {
        const io = req.app.get('io');

        const status = req.body;
        const requestId = req.params.requestId

        const response = await TargetsService.changeLocationStatus(status, requestId);

        io.emit('update-target');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
})

router.put('/changeTargetStatus/:jobId', async (req, res) => {
    try {
        const io = req.app.get('io');

        const status = req.body;
        const jobId = req.params.jobId

        const response = await TargetsService.changeTargetStatus(status, jobId);

        io.emit('update-target');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
})

router.get('/getAllTarget/:driverEmail', async (req, res) => {
    try {
        const driverEmail = req.params.driverEmail
        res.send(sendResponse(await TargetsService.getAllTargetById(driverEmail, undefined)))
    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

router.get('/getTarget/:driverEmail', async (req, res) => {
    try {
        const driverEmail = req.params.driverEmail
        res.send(sendResponse(await TargetsService.getNotCompletedTargetById(driverEmail, {status: 'NOT_COMPLETED'})))
    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

router.get('/all', async (_, res) => {
    res.send(sendResponse(await TargetsService.getAll()));
});



router.post('/deleteOne', async (req, res) => {
    try {
        const io = req.app.get('io');
        const response = await TargetsService.removeById(req.body);
        io.emit('delete-contact-us');
        console.log('delete one');
        res.send(sendResponse(response));
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()));
    }
});
// salon

router.get(`/allSalon`, async (_, res) => {
    res.send(sendResponse(await TargetsService.getAllSalon()))
})

router.post(`/updateDeliverStatus`, async (req, res) => {
    try {
        res.send(
            sendResponse(
                await TargetsService.updateNeedToDeliverStatus(
                    {salonId: `5efa2ed22e4e440d2463c900`, status: 'Delivered', deliverId: `5efa5f0881850944ac73553b`}
                ),
            )
        )
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

//test routes
router.get('/ping', (_, res) => res.send(sendResponse('TargetsService Route')));

router.post('/deleteAll', async (_, res) => {
    try {
        res.send(sendResponse(await TargetsService.removeAll()));
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
router.delete('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match post requests'))
});
module.exports = router;
