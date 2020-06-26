const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Donor = require('../models/donor');
const User = require('../models/user');


// signup
router.post('/signup', (req, res) => {


    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        token: req.body.token
    });

    let newDonor = new Donor({

    })

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Faild to register user'
            })
        } else {
            res.json({
                success: true,
                msg: 'User registere',
                user: user
            })
        }
    })
})


// Donor request
router.post('/addDonorRequest', (req, res) => {
    let request = {
        requestDay: req.body.requestDay,
        validDate : req.body.validDate,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        finished: false,
        canceled: false
    }
    Donor.addDonorRequest(req.body.email,request,(err,donor)=>{
        if (err) {
            console.log(err)
            res.json({
                data: err,
                success: false,
                msg: 'Faild to add donor requset'
            })
        } else {
            console.log(donor)
            res.json({
                data: donor,
                success: true,
                msg: 'Donor request added',
            })

        }
    })
})


// login


// authenticate


// validate

// check Fingerprint


// profile

module.exports = router;
