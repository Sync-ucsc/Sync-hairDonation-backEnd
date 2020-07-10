const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const Ip = require('../models/ip');
const { sendResponse} = require('../utils/response.utils');



// router.get('/get/:fingerprint', (req, res) => {

//     Ip.rint(req.params.fingerprint, (err, ip) => {
//         if (err) {
//             res.status(500);
//             res.json({
//                 data: '',
//                 success: false,
//                 msg: 'Failed to get the fingreprint'
//             })
//         } else {
//             if (fingerprint !== null) {
//                 res.json({
//                     data: fingerprint,
//                     success: true,
//                     msg: 'got the fingerprint',
//                 })
//             } else {
//                 res.json({
//                     data: '',
//                     success: true,
//                     msg: 'havent the fingerprint',
//                 })
//             }


//         }
//     })
// })

router.get('/getAll', (req, res) => {

    Ip.getAllIP((err, ip) => {
        if (err) {
            res.status(500);
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get the fingreprint'
            })
        } else {
            if (ip !== null) {
                res.json({
                    data: ip,
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

// router.post('/check', (req, res) => {

//     if (req.body.val) {
//         Fingerprint.checkFingerprint(req.body.Fingerprint, (err, fingerprint) => {
//             if (err) {
//                 res.status(500);
//                 res.json({
//                     data: '',
//                     success: false,
//                     msg: 'Failed to update the fingreprint'
//                 })
//             } else {
//                 res.json({
//                     data: fingerprint,
//                     success: true,
//                     msg: 'update the fingreprint',
//                 })
//             }
//         })
//     } else {
//         Fingerprint.blockFingerprint(req.body.Fingerprint, (err, fingerprint) => {
//             if (err) {
//                 res.status(500);
//                 res.json({
//                     data: '',
//                     success: false,
//                     msg: 'Failed to update the fingreprint'
//                 })
//             } else {
//                 res.json({
//                     data: fingerprint,
//                     success: true,
//                     msg: 'update the fingreprint',
//                 })
//             }
//         })
//     }


// })

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