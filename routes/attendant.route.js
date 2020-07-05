const express = require('express');
const app = express();
const router = express.Router();
const {sendResponse} = require('../utils/response.utils');


// Attendant model
let Attendant = require('../models/attendant');
let User=require('../models/user');

// Add an Attendant
router.route('/create').post((req, res, next) => {
    const io = req.app.get('io');
    let newAttendant = new Attendant({
        firstName: req.body.firstName,
        lastName:req.body.lastName,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        
    });
    console.log(newAttendant);
    let user = User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: 'attendant',
        email: req.body.email,
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
            Attendant.addAttendant(newAttendant, (err,attendant) => {
                if (err) {
                    res.status(500);
                    res.json({
                        data: err,
                        success: false,
                        msg: 'Failed to add attendant'
                    })
                } else {
                    res.json({
                        data: {
                            user: user,
                            attendant: attendant
                        },
                        success: true,
                        msg: 'Attendant Added',
                    })
                    io.emit('new-attendant');
                }
            })
        }
    })
})


// Get All Attendant
router.route('/').get((req, res) => {
    const io = req.app.get('io');
    Attendant.getAll((err, attendant) => {
        if (err) {
            res.status(500);
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get Attendants'
            })
        } else {
            res.json({
                data: attendant,
                success: true,
                msg: 'got attendants',
            })
        }
    })
})



// Get a single Attendant
router.get('/read/:id', (req, res) => {
    const io = req.app.get('io');
    Attendant.getById(req.params.id, (err, attendant) => {
        if (err) {
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get the attendant'
            })
        } else {
            res.json({
                data: attendant,
                success: true,
                msg: 'got the attendant',
            })
        }
    })
})


// Update Attendant
router.post('/update/:id', (req, res) => {
    const io = req.app.get('io');
    let updatedAttendant = Attendant({
        _id: req.params.id,
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        
    })

    Attendant.updateAttendant(updatedAttendant, (err, attendant) => {
        if (err) {
            res.json({
                data: err,
                success: false,
                msg: 'Failed to update attendant'
            })
        } else {
            res.json({
                data: attendant,
                success: true,
                msg: 'updated attendant',
            })
            io.emit('update-attendant');

        }


    })


})

// Delete an Attendant
router.delete('/delete/:id', (req, res) => {
    const io = req.app.get('io');
    console.log(req.params.id)

    Attendant.deleteAttendant(req.params.id, (err, attendant) => {
        if (err) {
            res.json({
                data: err,
                success: false,
                msg: 'Failed to delete the attendant'
            })
        } else {
            res.json({
                data: attendant,
                success: true,
                msg: 'Attendant deleted',
            })
            io.emit('delete-attendant');
        }
    });

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