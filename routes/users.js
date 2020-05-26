const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config =require('../config/database')
const User = require('../models/user')

//signup
router.post('/signup', (req,res) => {
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        token: req.body.token
    })

    User.addUser(newUser,(err,user)=>{
        if(err){
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

router.post('/authenticate', (req, res) => {
    const email = req.body.email; 
    const token = req.body.token;
    User.getUserBYEmail(email,(err,user)=>{
        if(err){
            throw err;
        }
        if(!user){
           return res.json({success: false, msg : 'User not found'});
        }
        User.compareToken(token, user.token, (err,isMatch) =>{
            if(err){
                throw err;
            }
            if(isMatch){
                const userToken = jwt.sign(({
                    "_id": user._id,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "email": user.email,
                }), config.secret, {
                    expiresIn: 604500
                });

                return res.json({
                    success: true,
                    userToken: 'JWT' + userToken,
                    user: {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                })
            } else {
                return res.json({success: false,msg:'token is invalid'})
            }
        });
    });
})

router.get('/profile', passport.authenticate('jwt',{session:false}), (req, res) => {
    res.json({user: req.user});
})

router.get('/validate', (req, res) => {
    res.send('validate')
})

module.exports = router;