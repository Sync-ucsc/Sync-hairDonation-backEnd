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


// login


// authenticate


// validate

// check Fingerprint


// profile

module.exports = router;
