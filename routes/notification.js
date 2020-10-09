const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const Notification = require('../models/notification');
const Subcribe = require('../models/subcribe');

const {sendResponse} = require('../utils/response.utils');
const webpush = require('web-push');
const subcribe = require('../models/subcribe');



//add notification
router.post('/add',async (req, res) => {
    const io = req.app.get('io');
    let newNotification = new Notification({
        massage: req.body.massage,
        title: req.body.title,
        role: req.body.role,
        validDate: req.body.validDate,
        icon: req.body.icon,
        notificationStatus: '1',
        groupID: '0',
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
            const vapidKeys = {
        publicKey: 'BE-J8ek0Xl6Mpgw5R6-B5M5BYISYVkQi6XVGmt8qymgz-u66hyrkEFcgZKJECL8bLHbPyPiVwgTaoH9EpP6VNlc',
        privateKey: 'K2cXkx8quUdVzwF35KBX9NRXrGBiRNXRoE1WNz_StBM'
    }

    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );

    const notificationPayload = JSON.stringify({
        "notification": {
            "title": req.body.title,
            "body": req.body.massage,
            "icon": "https://i.ibb.co/k5scTH9/logo.png",
            "vibrate": [100, 50, 100, 50],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    });

    
            

            if (req.body.role === 'all' ){
                
                Promise.resolve(

                    Subcribe.getAll((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('add-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            } else if (req.body.role === 'donor') {
                Promise.resolve(

                    Subcribe.getDonor((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('add-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            } else if (req.body.role === 'patient') {
                Promise.resolve(

                    Subcribe.getPatient((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('add-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            } else if (req.body.role === 'salon') {
                Promise.resolve(

                    Subcribe.getSalon((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('add-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            } else if (req.body.role === 'manager') {
                Promise.resolve(

                    Subcribe.getManager((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('add-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });
            } else if (req.body.role === 'attendant') {
                Promise.resolve(

                    Subcribe.getAttendant((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('add-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });
            } else if (req.body.role === 'driver') {
                Promise.resolve(

                    Subcribe.getDriver((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('add-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            }
           
        }
    })


})

router.post('/subcribe',async (req,res) => {
    let sub =req.body.sub;
    
    const vapidKeys = {
        publicKey: 'BE-J8ek0Xl6Mpgw5R6-B5M5BYISYVkQi6XVGmt8qymgz-u66hyrkEFcgZKJECL8bLHbPyPiVwgTaoH9EpP6VNlc',
        privateKey: 'K2cXkx8quUdVzwF35KBX9NRXrGBiRNXRoE1WNz_StBM'
    }
    let newsub = new Subcribe({
        sub: sub,
        role: req.body.role
    });

    Subcribe.addSubcribe(newsub,(err, asub) => {
            if (err) {
                res.status(500);
                res.json({
                    data: '',
                    success: false,
                    msg: 'Faild to add subcriber'
                })
                console.log(err)
            } else {
                console.log(asub)
                res.json({
                    data: sub,
                    success: true,
                    msg: 'subcriber add',
                })
            }
        }
    )

})

router.post('/send', async (req, res) => {
    const vapidKeys = {
        publicKey: 'BE-J8ek0Xl6Mpgw5R6-B5M5BYISYVkQi6XVGmt8qymgz-u66hyrkEFcgZKJECL8bLHbPyPiVwgTaoH9EpP6VNlc',
        privateKey: 'K2cXkx8quUdVzwF35KBX9NRXrGBiRNXRoE1WNz_StBM'
    }

    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );

    const notificationPayload = JSON.stringify({
        "notification": {
            "title": "Check Notification",
            "body": "Newsletter Available!",
            "icon": "https://i.ibb.co/k5scTH9/logo.png",
            "vibrate": [100, 50, 100, 50],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    });

    Promise.resolve(

        Subcribe.getAll((err,subs)=> {
        if(err){
            console.log(err)
        } else {
            console.log(subs)
            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
        }
    })).then(() => {
            res.status(200).json({
                data: notificationPayload,
                success: true,
                msg: 'notification add',
            })

        })
        .catch(err => {
            console.log(err)
            console.error("Error sending notification, reason: ", err);
            res.status(500).json({
                data: err,
                success: false,
                msg: 'Faild to add notification'
            })
        });
})

// Notification edit
router.post('/edit', (req, res) => {
    const io = req.app.get('io');
    let editNotification = Notification({
        _id : req.body._id,
        massage: req.body.massage,
        notificationStatus: req.body.notificationStatus,
        groupID: req.body.groupID,
        role: req.body.role,
        icon: req.body.icon,
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
router.delete('/delete/:id', (req, res) => {
    const io = req.app.get('io');
    Notification.deleteNotificationById(req.params.id, (err, notification) => {
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
router.get('/get/:id', (req, res) => {
    Notification.getById(req.params.id,(err, notification) => {
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

//subcribe


router.post('/repush', (req, res) => {
    Notification.getById(req.body.id, (err, notification) => {
        if (err) {
            res.status(500);
            res.json({
                data: '',
                success: false,
                msg: 'Faild to get notification'
            })
        } else {
            const vapidKeys = {
                publicKey: 'BE-J8ek0Xl6Mpgw5R6-B5M5BYISYVkQi6XVGmt8qymgz-u66hyrkEFcgZKJECL8bLHbPyPiVwgTaoH9EpP6VNlc',
                privateKey: 'K2cXkx8quUdVzwF35KBX9NRXrGBiRNXRoE1WNz_StBM'
            }
            

            webpush.setVapidDetails(
                'mailto:example@yourdomain.org',
                vapidKeys.publicKey,
                vapidKeys.privateKey
            );

            const notificationPayload = JSON.stringify({
                "notification": {
                    "title": notification.title,
                    "body": notification.massage,
                    "icon": "https://i.ibb.co/k5scTH9/logo.png",
                    "vibrate": [100, 50, 100, 50],
                    "data": {
                        "dateOfArrival": Date.now(),
                        "primaryKey": 1
                    },
                    "actions": [{
                        "action": "explore",
                        "title": "Go to the site"
                    }]
                }
            });

            if (notification.role === 'all') {
                console.log(notification)
                Promise.resolve(

                    Subcribe.getAll((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('repush-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            } else if (notification.role === 'donor') {
                Promise.resolve(

                    Subcribe.getDonor((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('repush-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            } else if (notification.role === 'patient') {
                Promise.resolve(

                    Subcribe.getPatient((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('repush-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            } else if (notification.role === 'salon') {
                Promise.resolve(

                    Subcribe.getSalon((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('repush-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

            } else if (notification.role === 'manager') {
                Promise.resolve(

                    Subcribe.getManager((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('repush-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });
            } else if (notification.role === 'attendant') {
                Promise.resolve(

                    Subcribe.getAttendant((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('repush-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });
            } else if (notification.role === 'driver') {
                Promise.resolve(

                    Subcribe.getDriver((err, subs) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(subs)
                            subs.map(sub => webpush.sendNotification(sub.sub, notificationPayload))
                        }
                    })).then(() => {
                        res.status(200).json({
                            data: notificationPayload,
                            success: true,
                            msg: 'notification add',
                        })
                        io.emit('repush-notification');

                    })
                    .catch(err => {
                        console.log(err)
                        console.error("Error sending notification, reason: ", err);
                        res.status(500).json({
                            data: err,
                            success: false,
                            msg: 'Faild to add notification'
                        })
                    });

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