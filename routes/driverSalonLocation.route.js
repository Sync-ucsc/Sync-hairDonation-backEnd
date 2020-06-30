const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');

const DriverSalonLocation = require('../services/driverSalonLocation.service');
const driverSalonLocation = new DriverSalonLocation();

router.use(bodyParser.urlencoded({extended: false}));

router.post('/add', async (req, res) => {
    try {
        const io = req.app.get('io');
        const response = await driverSalonLocation.addOne(req.body);
        // io.emit('new-contact-us');
        res.send(sendResponse(response));
    } catch (err) {
        console.log(err)
        res.send(sendResponse(undefined, false, err.toString()));
    }
});

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
                    {salonId: `5efa2ed22e4e440d2463c900`, status: 'Delivered', deliverId : `5efa5f0881850944ac73553b`}
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