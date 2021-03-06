const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {sendResponse} = require('../utils/response.utils');

const targetsService = require('../services/targets.service');
const TargetsService = new targetsService();

router.use(bodyParser.urlencoded({extended: false}));

// add new target document for driver
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

// add new Target to driver target document targets array
router.put('/addNewTargetToTarget/:driverEmail', async (req, res) => {
    try {
        const io = req.app.get('io');

        const locationData = req.body;
        const driverEmail = req.params.driverEmail
        const response = await TargetsService.addNewTargetToTargets(locationData, driverEmail);

        io.emit('update-target');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

// change location status in both target.targets and salon.NeedToDeliver
router.post('/changeSalonStatus', async (req, res) => {
    try {
        const io = req.app.get('io');

        const data = req.body;
        const requestId = req.body.requestId

        console.log(req.body)

        const response = await TargetsService.changeSalonStatus(data, requestId);

        io.emit('update-target');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
})

router.put(`/assignToDriver/:driverEmail`, async (req, res) =>{
   try{

       const driverEmail = req.params.driverEmail;
       const requestId = req.body.requestId;

       // find NOT_COMPLETED previous job doc is assign for driver
       const driverTarget = await TargetsService.getAllTargetById(driverEmail, { status: 'NOT_COMPLETED'});

        // if not found previous job doc
       if(driverTarget.length === 0) {
           // create new job for driver
           await TargetsService.addTargetToDriver(req.body)
           // assign new job to target array
           await TargetsService.addNewTargetToTargets(req.body, driverEmail)
           // change salon NeedToDeliver status

           await TargetsService.changeSalonNeedToDeliverStatus('AssignToDriver', requestId)

           return res.send(sendResponse(await TargetsService.getAllSalonNeedToDelivers()))
       }

       // assign new job to target array
       const  addNewTargetToDriver = await TargetsService.addNewTargetToTargets(req.body, driverEmail)

       // change salon NeedToDeliver status

       await TargetsService.changeSalonNeedToDeliverStatus('AssignToDriver', requestId)

       res.send(sendResponse(driverEmail))

   }catch (error) {
       console.log(error)
       res.send(sendResponse(undefined, false, error.toString()))
   }
});

// change target status
router.post('/changeTargetStatus', async (req, res) => {
    try {
        const io = req.app.get('io');

        const status = req.body;
        const targetId = req.body.targetId

        const response = await TargetsService.changeTargetStatus(status, targetId);

        io.emit('update-target');

        res.send(sendResponse(response));
    } catch (error) {
        console.log(error)
        res.send(sendResponse(undefined, false, error.toString()));
    }
})

// get all target of a driver by email
router.get('/getAllTarget/:driverEmail', async (req, res) => {
    try {
        const driverEmail = req.params.driverEmail
        res.send(sendResponse(await TargetsService.getAllTargetById(driverEmail, undefined)))
    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

// get NOT_COMPLETED target of a driver
router.get('/getTarget/:driverEmail', async (req, res) => {
    try {
        const driverEmail = req.params.driverEmail
        res.send(sendResponse(await TargetsService.getNotCompletedTargetById(driverEmail, {status: 'NOT_COMPLETED'})))
    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

// get all driver targets
router.get('/all', async (_, res) => {
    res.send(sendResponse(await TargetsService.getAll()));
});

// remove driver target by object id
router.post('/deleteTarget', async (req, res) => {
    try {
        const io = req.app.get('io');
        const response = await TargetsService.removeTargetById(req.body);
        io.emit('delete-contact-us');
        console.log('delete one');
        res.send(sendResponse(response));
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()));
    }
});

// route connect with SALON model

// get all Salons
router.get(`/allSalon`, async (_, res) => {
    res.send(sendResponse(await TargetsService.getAllSalon()))
})

// get Salon Need to delivers
router.get(`/getSalonNeedToDelivers/:salonId`, async (req, res) => {
    try {

        const salonId = req.params.salonId;
        const response = await TargetsService.getSalonNeedToDelivers(salonId);

        res.send(sendResponse(response))

    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

// get All salons need to delivers
router.get(`/allSalonNeedToDelivers`, async (req, res) => {
    try {

        const response = await TargetsService.getAllSalonNeedToDelivers()

        res.send(sendResponse(response))

    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

// add new deliver to salon
router.put(`/addNewDeliver/:salonId`, async (req , res) => {
    try{
        const io = req.app.get(`io`);

        const salonId = req.params.salonId
        const response = await TargetsService.addNewDeliveryToSalon(salonId)

        io.emit(`add-new-deliver-to-salon`)

        res.send(sendResponse(response))

    }catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

// update salon need to deliver status
router.post(`/updateDeliverStatus`, async (req, res) => {
    try {
        res.send(
            sendResponse(
                await TargetsService
                    .updateNeedToDeliverStatus({ status: 'Delivered', deliverId: `5efa5f0881850944ac73553b`}),
            )
        )
    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

// get all drivers
router.get(`/allDrivers`, async (req, res) => {
    try{
        const response = await TargetsService.getAllDrivers();
        res.send(sendResponse(response))
    }catch (error) {
        res.send(sendResponse(undefined,false, error.toString()))
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
    res.send(sendResponse(undefined, false, 'path not match put requests'))
});
router.delete('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match delete requests'))
});

module.exports = router;
