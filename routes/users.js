const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config =require('../config/database')
const User = require('../models/user')
const Donor = require('../models/donor')

//signup
router.post('/signup', (req,res) => {
    if (req.body.role == 'donor' || req.body.role == 'patient'){
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
                if (req.body.role == 'patient'){
                    
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

router.post('/authenticate', (req, res) => {
    const email = req.body.email; 
    const password = req.body.password;
    var host = req.app.get('host');
   
    User.getUserBYEmail(email,(err,user)=>{
        if(err){
            throw err;
        }
        if(!user){
           return res.json({
               data: '',
               success: false, 
               msg : 'User not found'
            });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err){
                throw err;
            }
            if(user.active){
                if (isMatch) {

                    if (user.temporyBan) {
                        return res.json({
                            data: '',
                            success: false,
                            msg: 'user ban by admin'
                        })
                    } else {
                        const userToken = jwt.sign(({
                            "_id": user._id,
                            "role": user.role,
                            "banAction": user.banAction,
                            "firstName": user.firstName,
                            "lastName": user.lastName,
                            "email": user.email,
                            "iss": host +'/user',
                        }), config.secret, {
                            expiresIn: 604500
                        });

                        return res.json({
                            data: {
                                userToken: 'JWT' + userToken,
                                user: {
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }
                            },
                            success: true,
                            msg: 'sign in'

                        })
                    }
                } else {
                    return res.json({
                        data: '',
                        success: false,
                        msg: 'Password is invalid'
                    })
                }
            } else {
                if (isMatch) {

                    const userToken = jwt.sign(({
                        "_id": user._id,
                        "role": user.role,
                        "banAction": user.banAction,
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                        "email": user.email,
                    }), config.secret, {
                        expiresIn: 604500
                    });

                    return res.json({
                        data: {
                            userToken: 'JWT' + userToken,
                            user: {
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName
                            }
                        },
                        success: true,
                        msg: 'password change'

                    })
                } else {
                    return res.json({
                        data: '',
                        success: false,
                        msg: 'token is invalid'
                    })
                }
            }
            
        });
    });
})

router.get('/profile', passport.authenticate('jwt',{session:false}), (req, res) => {
    res.json({
        data: {
            "_id": req.user._id,
            "role": req.user.role,
            "banAction": req.user.banAction,
            "firstName": req.user.firstName,
            "lastName": req.user.lastName,
            "active": req.user.active,
            "email": req.user.email,
        },
        success: true,
        msg: 'User profile',
    });
})

router.get('/validate', (req, res) => {
    res.send('validate')
})


router.post('/activate',  passport.authenticate('jwt',{session:false}),(req,res) =>{
     console.log(req.body._id);
    User.activate(req.body._id, req.body.password, (err, user) => {
                if (err) {
                    res.json({
                        data: '',
                        success: false,
                        msg: 'Faild to Password change'
                    })
                } else {
                    res.json({
                        data: user,
                        success: true,
                        msg: 'Password change',
                    })
                }
            })
})


//example
router.post('/register', (req, res) => {
    let user = User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        email: req.body.email,
    })
    User.register(user, (err, user) => {
        if (err) {
            res.json({
                data: '',
                success: false,
                msg: 'Faild to register user'
            })
        } else {
            res.json({
                data: user,
                success: true,
                msg: 'User registere',
            })
        }
    })
})




module.exports = router;