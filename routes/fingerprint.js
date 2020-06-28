const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const Fingerprint = require('../models/fingerprint');


//signup
router.post('/signup', (req, res) => {
    if (req.body.role == 'donor' || req.body.role == 'patient') {
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role,
            temporyBan: false,
            active: true,
            password: req.body.password
        })

        let newDonor = new Donor({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            telePhone: req.body.telePhone,
        });

        User.addUser(newUser, (err, user) => {
            if (err) {

                res.json({
                    data: '',
                    success: false,
                    msg: 'Faild to register user'
                })
            } else {
                console.log(user)
                if (req.body.role == 'patient') {

                } else {
                    console.log(newDonor)
                    Donor.addDonor(newDonor, (err, donor) => {
                        if (err) {
                            res.json({
                                data: err,
                                success: false,
                                msg: 'Faild to register user'
                            })

                        } else {
                            res.json({
                                data: {
                                    user: user,
                                    donor: donor
                                },
                                success: true,
                                msg: 'User registere',
                            })
                        }
                    })
                }
            }
        })

    } else {
        res.json({
            data: err,
            success: false,
            msg: 'Faild to register user'
        });
    }
})

router.get('/get/:fingerprint',(req,res) =>{
    Fingerprint.getFingerprint(req.params.fingerprint,(err,fingerprint)=>{
        if (err) {
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get the fingreprint'
            })
        } else {
            console.log(fingerprint);
            if(fingerprint !== null){
                res.json({
                    data: fingerprint,
                    success: true,
                    msg: 'got the fingerprint',
                })
            } else {
                res.json({
                    data: '',
                    success: true,
                    msg: 'havent the fingerprint',
                })
            }

            
        }
    })
})

module.exports = router;
