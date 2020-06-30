const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const Fingerprint = require('../models/fingerprint');



router.get('/get/:fingerprint',(req,res) =>{
    

    
    Fingerprint.getFingerprint(req.params.fingerprint,(err,fingerprint)=>{
        if (err) {
            res.status(500);
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get the fingreprint'
            })
        } else {
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
