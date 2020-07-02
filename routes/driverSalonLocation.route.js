const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');

const DriverSalonLocation = require('../services/driverSalonLocation.service');
const driverSalonLocation = new DriverSalonLocation();

router.use(bodyParser.urlencoded({extended: false}));

router.post('/addJobToDriver', async (req, res) => {
    try {
        const io = req.app.get('io');
        const response = await driverSalonLocation.addJobToDriver(req.body);
        io.emit('new-driver-location');
        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
});


router.put('/addNewLocationToDriver/:driverId', async (req, res) => {
    try {
        const io = req.app.get('io');

        const locationData = req.body;
        const driverId = req.params.driverId
        const response = await driverSalonLocation.addNewLocationToDriver(locationData, driverId);

        io.emit('update-driver-location');

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

        const response = await driverSalonLocation.changeLocationStatus(status, requestId);

        io.emit('update-driver-location');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
})

router.put('/changeJobStatus/:jobId', async (req, res) => {
    try {
        const io = req.app.get('io');

        const status = req.body;
        const jobId = req.params.jobId

        const response = await driverSalonLocation.changeJobStatus(status, jobId);

        io.emit('update-driver-location');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
})

router.put('/getJob/:driverId', async (req, res) => {
    try {
        const driverId = req.params.driverId
        res.send(sendResponse(await driverSalonLocation.getJobById(driverId, req.body)))
    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

router.get('/all', async (_, res) => {
    res.send(sendResponse(await driverSalonLocation.getAll()));
});



router.post('/deleteOne', async (req, res) => {
    try {
        const io = req.app.get('io');
        const response = await driverSalonLocation.removeById(req.body);
        io.emit('delete-contact-us');
        console.log('delete one');
        res.send(sendResponse(response));
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()));
    }
});
// salon

router.get(`/allSalon`, async (_, res) => {
    res.send(sendResponse(await driverSalonLocation.getAllSalon()))
})

router.post(`/updateDeliverStatus`, async (req, res) => {
    try {
        res.send(
            sendResponse(
                await driverSalonLocation.updateNeedToDeliverStatus(
                    {salonId: `5efa2ed22e4e440d2463c900`, status: 'Delivered', deliverId: `5efa5f0881850944ac73553b`}
                ),
            )
        )
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

//test routes
router.get('/ping', (_, res) => res.send(sendResponse('driverSalonLocation Route')));

router.post('/deleteAll', async (_, res) => {
    try {
        res.send(sendResponse(await driverSalonLocation.removeAll()));
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
