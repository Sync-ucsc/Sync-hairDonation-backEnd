const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const Fingerprint = require('../models/fingerprint');
const {sendResponse} = require('../utils/response.utils');



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