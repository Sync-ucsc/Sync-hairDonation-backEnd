const express = require('express');
const app = express();
const router = express.Router();
const {sendResponse} = require('../utils/response.utils');
const targets = require('../models/targets.model');


// Driver model
let Driver = require('../models/driver');
let User=require('../models/user');

// Add a Driver
router.route('/create').post((req, res, next) => {
    const io = req.app.get('io');
    let newDriver = new Driver({
        firstName: req.body.firstName,
        lastName:req.body.lastName,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        
    });
    console.log(newDriver);
    let user = User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: 'driver',
        email: req.body.email,
        telephone: req.body.telephone,
    })

    User.register(user, (err, user) => {
        if (err) {
            res.status(500);
            res.json({
                data: '',
                success: false,
                msg: 'Failed to register user'
            })
        } else {
            Driver.addDriver(newDriver, (err, driver) => {
                if (err) {
                    res.status(500);
                    res.json({
                        data: err,
                        success: false,
                        msg: 'Failed to add driver'
                    })
                } else {
                    res.json({
                        data: {
                            user: user,
                            driver: driver
                        },
                        success: true,
                        msg: 'Driver Added',
                    })
                    io.emit('check-user');
                    io.emit('new-driver');
                }
            })
        }
    })
})


// Get All Drivers
router.route('/').get((req, res) => {
    const io = req.app.get('io');
    Driver.getAll((err, driver) => {
        if (err) {
            res.status(500);
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get drivers'
            })
        } else {
            res.json({
                data: driver,
                success: true,
                msg: 'got drivers',
            })
        }
    })
})



// Get a single Driver
router.get('/read/:id', (req, res) => {
    const io = req.app.get('io');
    Driver.getById(req.params.id, (err, driver) => {
        if (err) {
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get the driver'
            })
        } else {
            res.json({
                data: driver,
                success: true,
                msg: 'got the driver',
            })
        }
    })
})


// Update Driver
router.post('/update/:id', (req, res) => {
    const io = req.app.get('io');
    let updatedDriver = Driver({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        
    })

    Driver.updateDriver(updatedDriver, (err, driver) => {
        if (err) {
            res.json({
                data: err,
                success: false,
                msg: 'Failed to update driver'
            })
        } else {
            res.json({
                data: driver,
                success: true,
                msg: 'updated driver',
            })
            io.emit('update-driver');

        }


    })


})

// Delete a Driver
router.delete('/delete/:id', (req, res) => {
    const io = req.app.get('io');
    console.log(req.params.id)

    Driver.deleteDriver(req.params.id, (err, driver) => {
        if (err) {
            res.json({
                data: err,
                success: false,
                msg: 'Failed to delete the driver'
            })
        } else {

            res.json({
                data: driver,
                success: true,
                msg: 'Driver deleted',
            })
            io.emit('check-user');
            io.emit('delete-driver');
        }
    });

})



// change location
router.post('/changeLocation', (req, res) => {
  Driver.changeLocation(req.body.lat,req.body.lon,req.body.email,(err,driver)=>{
        if (err) {
          res.status(500);
            res.json({
                data: err,
                success: false,
                msg: 'Faild to change location'
            })
        } else {
            targets.notify(req.body.lat, req.body.lon,req.body.email, (err, driver) => {})
            
            res.json({
                data: driver,
                success: true,
                msg: 'Driver location change',
            })

        }
    })
})

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
