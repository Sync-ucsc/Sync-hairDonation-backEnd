const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const Notification = require('../models/notification');

const {sendResponse} = require('../utils/response.utils');


//add notification
router.post('/add', (req, res) => {
    const io = req.app.get('io');
    let newNotification = new Notification({
        massage: req.body.massage,
        notificationType: req.body.notificationType,
        groupID: req.body.groupID,
        role: req.body.role,
        validDate: req.body.validDate
    });

    console.log(newNotification)

    Notification.addNotification(newNotification, (err, notification) => {
        if (err) {
            res.status(500);
            res.json({
                data: err,
                success: false,
                msg: 'Faild to add notification'
            })
        } else {
            res.json({
                data: notification,
                success: true,
                msg: 'notification add',
            })
            io.emit('add-notification');
        }
    })


})

// Notification edit
router.post('/edit', (req, res) => {
    const io = req.app.get('io');
    let editNotification = Notification({
        _id : req.body._id,
        massage: req.body.massage,
        notificationType: req.body.notificationType,
        groupID: req.body.groupID,
        role: req.body.role,
        validDate: req.body.validDate,
        __v: 0
    })

    Notification.editNotification(editNotification, (err, notification) => {
        if (err) {
            res.status(500);
            res.json({
                data: err,
                success: false,
                msg: 'Faild to edit notification'
            })
        } else {
            res.json({
                data: notification,
                success: true,
                msg: 'notification edit',
            })
            io.emit('edit-notification');

        }
    })
        

})

// notifications delete all
router.delete('/all',(req,res) =>{
    const io = req.app.get('io');
    Notification.deleteNotificationAll((err, notification) => {
        if (err) {
            res.status(500);
            res.json({
                data: '',
                success: false,
                msg: 'Faild to delete all notifications'
            })
        } else {
            res.json({
                data: "",
                success: true,
                msg: 'notifications all delete ',
            })
            io.emit('delet-notification');
        }
    });

})


// notification delete
router.delete('/delete', (req, res) => {
    const io = req.app.get('io');
    Notification.deleteNotificationById(req.body._id, (err, notification) => {
        if (err) {
            res.status(500);
            res.json({
                data: err,
                success: false,
                msg: 'Faild to delete notifications'
            })
        } else {
            res.json({
                data: notification,
                success: true,
                msg: 'notification delete ',
            })
            io.emit('delet-notification');
        }
    });

})

//notification get all
router.get('/all', (req, res) => {
    Notification.getAll((err, notifications) => {
    if (err) {
        res.status(500);
        res.json({
            data: '',
            success: false,
            msg: 'Faild to get notifications'
        })
    } else {
        res.json({
            data: notifications,
            success: true,
            msg: 'notifications get',
        })
    }
    })
})


//notification get by id
router.get('/get', (req, res) => {
    Notification.getById(req.body.id,(err, notification) => {
        if (err) {
            res.status(500);
            res.json({
                data: '',
                success: false,
                msg: 'Faild to get notification'
            })
        } else {
            res.json({
                data: notification,
                success: true,
                msg: 'notification get',
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