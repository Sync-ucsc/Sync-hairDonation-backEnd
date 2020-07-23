const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config =require('../config/database')
const User = require('../models/user')
const Donor = require('../models/donor')
const Fingerprint = require('../models/fingerprint')
const Ip = require('../models/ip')
const Patient = require('../models/patient')
var ipapi = require('ipapi.co')


const {sendResponse} = require('../utils/response.utils');
const patient = require('../models/patient');

const EmailService = require('../services/email.service');
const emailService = new EmailService();


//signup donor and patient
router.post('/signup', (req,res) => {
    const io = req.app.get('io');
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress

    z = ['112.135.14.4', '112.134.15.8', '112.134.56.6', '112.135.250.50', '220.247.224.55', '61.245.163.70', '112.134.235.161']
    // ip = z[Math.floor(Math.random() * z.length)]
    ip = '112.134.56.6'

    ipapi.location((ipdata) => {
        let nuser = {
            email: req.body.email,
            registerIp: ip,
            userType: req.body.role,
            city: ipdata.city,
        }
        let newIP = new Ip({
            ipv4: ip,
            fingerprint: req.body.fingerprint,
            city: ipdata.city,
            region: ipdata.region,
            country: ipdata.country,
            userType: [req.body.role],
            users: [nuser],
        })
        if (req.body.role == 'donor' || req.body.role == 'patient') {
            let newUser = new User({
                firstName: req.body.fname,
                lastName: req.body.lname,
                email: req.body.email,
                role: req.body.role,
                registerIP: ip,
                registerCity: ipdata.city,
                telephone: req.body.phone,
                temporyBan: false,
                active: false,
                password: req.body.password
            })
            let newDonor = new Donor({
                firstName: req.body.fname,
                lastName: req.body.lname,
                email: req.body.email,
                telePhone: req.body.phone,
                nic: req.body.nic,
                address: req.body.address,
                lat: req.body.lat,
                lon: req.body.lon,
                fingerprint: req.body.fingerprint

            });

            let newPatient = new Patient({
                firstName: req.body.fname,
                lastName: req.body.lname,
                email: req.body.email,
                telePhone: req.body.phone,
                nic: req.body.nic,
                address: req.body.address,
                patientNumber: req.body.patientNumber,
                patientReport: req.body.patientReport,
                fingerprint: req.body.fingerprint
            });


            let fingerprint = new Fingerprint({
                Fingerprint: req.body.fingerprint,
                userType: [req.body.role],
                users: [nuser],
                block: false,
                check: false
            })





            User.addUser(newUser, (err, user) => {
                if (err) {
                    res.status(500);
                    res.json({
                        data: err,
                        success: false,
                        msg: 'Faild to register user'
                    });
                } else {
                    if (req.body.role == 'patient') {
                        Patient.addPatient(newPatient, (err, patient) => {
                            if (err) {
                                res.status(500);
                                User.deleteUserById(user._id, (err, dd) => {});
                                res.json({
                                    data: err,
                                    success: false,
                                    msg: 'Faild to register user'
                                })

                            } else {
                                if (req.body.fpcount == 0) {
                                    Fingerprint.addFingerprint(fingerprint, (err, fingerprintpay) => {
                                        if (err) {
                                            res.status(500);
                                            User.deleteUserById(user._id, (err, dd) => {});
                                            Patient.deletePatient(patient._id, (err, dd) => {});
                                            res.json({
                                                data: err,
                                                success: false,
                                                msg: 'Faild to register user'
                                            })
                                        } else {
                                            Ip.addIp(newIP, nuser, 'patient', (err, ippay) => {
                                                if (err) {
                                                    res.status(500);
                                                    User.deleteUserById(user._id, (err, dd) => {});
                                                    Patient.deletePatient(patient._id, (err, dd) => {});
                                                    Fingerprint.deleteFingerprintById(user._id, (err, dd) => {});
                                                    res.json({
                                                        data: err,
                                                        success: false,
                                                        msg: 'Faild to register user'
                                                    })
                                                } else {
                                                    res.json({
                                                        data: {
                                                            user: user,
                                                            patient: patient,
                                                            fingerprint: fingerprintpay,
                                                            ip: ippay
                                                        },
                                                        success: true,
                                                        msg: 'User registere',
                                                    })
                                                    io.emit('check-user');
                                                }
                                            });




                                        }
                                    })
                                } else if (req.body.fpcount == 1) {
                                    Fingerprint.editFingerprint(req.body.fingerprint, nuser, 'patient', (err, fingerprintpay) => {
                                        if (err) {
                                            res.status(500);
                                            User.deleteUserById(user._id, (err, dd) => {});
                                            Patient.deletePatient(patient._id, (err, dd) => {});
                                            res.json({
                                                data: err,
                                                success: false,
                                                msg: 'Faild to register user'
                                            })
                                        } else {
                                            Fingerprint.blockFingerprint(req.body.fingerprint, (err, fingerprintpay2) => {
                                                if (err) {
                                                    res.status(500);
                                                    User.deleteUserById(user._id, (err, dd) => {});
                                                    Patient.deletePatient(patient._id, (err, dd) => {});
                                                    res.json({
                                                        data: err,
                                                        success: false,
                                                        msg: 'Faild to register user'
                                                    })
                                                } else {
                                                    Ip.addIp(newIP, nuser, 'patient', (err, ippay) => {
                                                        if (err) {
                                                            res.status(500);
                                                            User.deleteUserById(user._id, (err, dd) => {});
                                                            Patient.deletePatient(patient._id, (err, dd) => {});
                                                            res.json({
                                                                data: err,
                                                                success: false,
                                                                msg: 'Faild to register user'
                                                            })
                                                        } else {
                                                            res.json({
                                                                data: {
                                                                    user: user,
                                                                    patient: patient,
                                                                    fingerprint: fingerprint,
                                                                    ip:ippay
                                                                },
                                                                success: true,
                                                                msg: 'User registere',
                                                            })
                                                            io.emit('check-user');
                                                        }
                                                    });
                                                }



                                            })

                                        }
                                    })
                                } else {
                                    res.status(500);
                                    User.deleteUserById(user._id, (err, dd) => {});
                                    Patient.deletePatient(patient._id, (err, dd) => {});
                                    res.json({
                                        data: err,
                                        success: false,
                                        msg: 'Faild to register user'
                                    })
                                }

                            }
                        })
                    } else {
                        Donor.addDonor(newDonor, (err, donor) => {
                            if (err) {
                                res.status(500);
                                User.deleteUserById(user._id, (err, dd) => {});
                                res.json({
                                    data: err,
                                    success: false,
                                    msg: 'Faild to register user'
                                })

                            } else {
                                if (req.body.fpcount == 0) {
                                    Fingerprint.addFingerprint(fingerprint, (err, fingerprintpay) => {
                                        if (err) {
                                            res.status(500);
                                            User.deleteUserById(user._id, (err, dd) => {});
                                            Donor.deleteDonor(donor._id, (err, dd) => {});
                                            res.json({
                                                data: err,
                                                success: false,
                                                msg: 'Faild to register user'
                                            })
                                        } else {
                                            Ip.addIp(newIP, nuser, 'donor', (err, ippay) => {
                                                if (err) {
                                                    res.status(500);
                                                    User.deleteUserById(user._id, (err, dd) => {});
                                                    Donor.deleteDonor(donor._id, (err, dd) => {});
                                                    Fingerprint.deleteFingerprintById(user._id, (err, dd) => {});
                                                    res.json({
                                                        data: err,
                                                        success: false,
                                                        msg: 'Faild to register user'
                                                    })
                                                } else {
                                                    emailService.sendmailDonorRegistation(user, () => {});
                                                    res.json({
                                                        data: {
                                                            user: user,
                                                            donor: donor,
                                                            fingerprint: fingerprintpay,
                                                            ip: ippay
                                                        },
                                                        success: true,
                                                        msg: 'User registere',
                                                    })
                                                    io.emit('check-user');
                                                }
                                            });
                                        }




                                    })
                                } else if (req.body.fpcount == 1) {
                                    Fingerprint.editFingerprint(req.body.fingerprint, nuser, 'donor', (err, fingerprintpay) => {
                                        if (err) {
                                            res.status(500);
                                            User.deleteUserById(user._id, (err, dd) => {});
                                            Donor.deleteDonor(donor._id, (err, dd) => {});
                                            res.json({
                                                data: err,
                                                success: false,
                                                msg: 'Faild to register user'
                                            })
                                        } else {
                                            Fingerprint.blockFingerprint(req.body.fingerprint, (err, fingerprintpay1) => {
                                                if (err) {
                                                    res.status(500);
                                                    User.deleteUserById(user._id, (err, dd) => {});
                                                    Donor.deleteDonor(donor._id, (err, dd) => {});
                                                    res.json({
                                                        data: err,
                                                        success: false,
                                                        msg: 'Faild to register user'
                                                    })
                                                } else {

                                                    Ip.addIp(newIP, nuser, 'donor', (err, ippay) => {
                                                        if (err) {
                                                            res.status(500);
                                                            User.deleteUserById(user._id, (err, dd) => {});
                                                            Donor.deleteDonor(donor._id, (err, dd) => {});
                                                            res.json({
                                                                data: err,
                                                                success: false,
                                                                msg: 'Faild to register user'
                                                            })
                                                        } else {
                                                            emailService.sendmailDonorRegistation(user, () => {});
                                                            res.json({
                                                                data: {
                                                                    user: user,
                                                                    donor: donor,
                                                                    fingerprint: fingerprint,
                                                                    ip:ippay
                                                                },
                                                                success: true,
                                                                msg: 'User registere',
                                                            })
                                                            io.emit('check-user');
                                                        }
                                                    });
                                                }



                                            })

                                        }
                                    })
                                } else {
                                    res.status(500);
                                    User.deleteUserById(user._id, (err, dd) => {});
                                    Donor.deleteDonor(donor._id, (err, dd) => {});
                                    res.json({
                                        data: err,
                                        success: false,
                                        msg: 'Faild to register user'
                                    })
                                }

                            }
                        })
                    }
                }
            })

        } else {
            res.status(500);
            res.json({
                data: err,
                success: false,
                msg: 'Faild to register user'
            });
        }
    },ip)
})

router.post('/authenticate', (req, res) => {
    const email = req.body.email; 
    const password = req.body.password;
    var host = req.app.get('host');
    // var host = 'https://syncucsc.herokuapp.com';
    const io = req.app.get('io');

    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
    z = ['112.135.14.4', '112.134.15.8', '112.134.56.6', '112.135.250.50', '220.247.224.55', '61.245.163.70', '112.134.235.161']
    // ip = z[Math.floor(Math.random() * z.length)]
    ip = '112.134.56.6'
   
    User.getUserBYEmail(email,(err,user)=>{
        if(err){
            res.status(500);
            return res.json({
                data: err,
                success: false,
                msg: 'err'
            });
        }
        if(!user){
            res.status(500);
            return res.json({
               data: '',
               success: false, 
               msg : 'User not found'
            });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err){
                res.status(500);
                return res.json({
                    data: err,
                    success: false,
                    msg: 'error'
                });
            }
            if(user.active){
                if (isMatch) {
                    ipapi.location((ipdata) => {
                        let nuser = {
                            email: user.email,
                            registerIp: ip,
                            userType: user.role,
                            city: ipdata.city,
                        }
                        let newIP = new Ip({
                            ipv4: ip,
                            city: ipdata.city,
                            region: ipdata.region,
                            country: ipdata.country,
                            userType: [user.role],
                            users: [nuser],
                        })
                        Ip.addIp(newIP, nuser, user.role, (err, ippay) => {
                            if (err) {
                                res.status(500);
                                res.json({
                                    data: err,
                                    success: false,
                                    msg: 'Faild to register user'
                                })
                            } else {
                                io.emit('check-user');
                                if (user.temporyBan) {
                                    res.status(500);
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
                                        "profilePic": user.profilePic,
                                        "telephone": user.telephone,
                                        "iss": host + '/user',
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
                            }
                        })

                    }, ip)
                    
                } else {
                    res.status(500);
                    return res.json({
                        data: '',
                        success: false,
                        msg: 'Password is invalid'
                    })
                }
            } else {
                if (isMatch) {
                    ipapi.location((ipdata) => {
                        let nuser = {
                            email: user.email,
                            registerIp: ip,
                            userType: user.role,
                            city: ipdata.city,
                        }
                        let newIP = new Ip({
                            ipv4: ip,
                            city: ipdata.city,
                            region: ipdata.region,
                            country: ipdata.country,
                            userType: [user.role],
                            users: [nuser],
                        })
                         Ip.addIp(newIP, nuser, user.role, (err, ippay) => {
                             if (err) {
                                 res.status(500);
                                 res.json({
                                     data: err,
                                     success: false,
                                     msg: 'Faild to register user'
                                 })
                             } else {
                                 io.emit('check-user');
                                 const userToken = jwt.sign(({
                                     "_id": user._id,
                                     "role": user.role,
                                     "banAction": user.banAction,
                                     "firstName": user.firstName,
                                     "lastName": user.lastName,
                                     "email": user.email,
                                     "profilePic": user.profilePic,
                                    "telephone": user.telephone,
                                     "iss": host + '/user',
                                 }), config.secret, {
                                     expiresIn: 604500
                                 });
                                 if (user.role == 'patient') {
                                     return res.json({
                                         data: {
                                             user: {
                                                 email: user.email,
                                                 firstName: user.firstName,
                                                 lastName: user.lastName
                                             }
                                         },
                                         success: true,
                                         msg: 'wait for attendant'

                                     })
                                 } else if (user.role == 'donor') {
                                     return res.json({
                                         data: {
                                             user: {
                                                 email: user.email,
                                                 firstName: user.firstName,
                                                 lastName: user.lastName
                                             }
                                         },
                                         success: true,
                                         msg: 'email verification'

                                     })
                                 } else {
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
                                 }
                             }
                         });
                    }, ip)
                   

                    
                } else {
                    res.status(500);
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

router.post('/emairequest',(req, res) => {
    User.reqestmail(req.body.email, (err, user) => {
        if (err) {
            res.status(500);
            return res.json({
                data: err,
                success: false,
                msg: 'err'
            });
        } else {
            return res.json({
                data: user,
                success: true,
                msg: 'email send'

            })

        }
    })
})

router.post('/request', (req, res) => {
    const email = req.body.email;
    const token = req.body.token;
    var host = req.app.get('host');
    // var host = 'https://syncucsc.herokuapp.com';
    console.log(token)

    User.getUserBYEmail(email, (err, user) => {
        if (err) {

            res.status(500);
            return res.json({
                data: err,
                success: false,
                msg: 'err'
            });
        }
        if (!user) {
            res.status(500);
            return res.json({
                data: '',
                success: false,
                msg: 'User not found'
            });
        }
        if(user.token != '0'){
            console.log(user)
            User.comparePassword(token, user.token.toString(), (err, isMatch) => {
                if (err) {
                    console.log(err)
                    res.status(500);
                    return res.json({
                        data: err,
                        success: false,
                        msg: 'error'
                    });
                } else {
                    if (isMatch) {
                        const userToken = jwt.sign(({
                            "_id": user._id,
                            "role": user.role,
                            "banAction": user.banAction,
                            "firstName": user.firstName,
                            "lastName": user.lastName,
                            "email": user.email,
                            "profilePic": user.profilePic,
                            "telephone": user.telephone,
                            "iss": host + '/user',
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
                        res.status(500);
                        return res.json({
                            data: '',
                            success: false,
                            msg: 'token is invalid'
                        })
                    }
                    
                }
            })
        } else {
            User.comparePassword(token, user.password, (err, isMatch) => {
                if (err) {
                    res.status(500);
                    return res.json({
                        data: err,
                        success: false,
                        msg: 'error'
                    });
                } else {
                    if (isMatch) {
                        const userToken = jwt.sign(({
                            "_id": user._id,
                            "role": user.role,
                            "banAction": user.banAction,
                            "firstName": user.firstName,
                            "lastName": user.lastName,
                            "email": user.email,
                            "profilePic": user.profilePic,
                            "telephone": user.telephone,
                            "iss": host + '/user',
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
                        res.status(500);
                        return res.json({
                            data: '',
                            success: false,
                            msg: 'token is invalid'
                        })
                    }
                }
            })
        }
    });
})

router.post('/donorActive', (req, res) => {
    const io = req.app.get('io');
    let id = req.body.id;
    let email = req.body.email;
    User.getUserBYEmail(email, (err, user) => {
                if (err) {
                    res.status(500);
                    return res.json({
                        data: err,
                        success: false,
                        msg: 'user not found'
                    });
                } else {
                    if(!user){
                        res.status(500);
                        return res.json({
                            data: err,
                            success: false,
                            msg: 'user not found'
                        });
                    }
                    else if(user._id == id && user.role == 'donor') {
                        User.sUserActivate(user._id, (err, user) => {
                            if (err) {
                                res.status(500);
                                res.json({
                                    data: '',
                                    success: false,
                                    msg: 'Faild to active'
                                })
                            } else {
                                res.json({
                                    data: user,
                                    success: true,
                                    msg: 'user active',
                                })
                                io.emit('check-user');
                            }
                        })

                    } else {
                        res.status(500);
                        return res.json({
                            data: err,
                            success: false,
                            msg: 'user not found'
                        });
                    }
                }
            })
});

router.post('/patientActivate', (req, res) => {
    const io = req.app.get('io');
    let email = req.body.email;
    User.getUserBYEmail(email, (err, user) => {
        if (err) {
            res.status(500);
            return res.json({
                data: err,
                success: false,
                msg: 'user not found'
            });
        } else {
            if (!user) {
                res.status(500);
                return res.json({
                    data: err,
                    success: false,
                    msg: 'user not found'
                });
            } else if ( user.role == 'patient') {
                User.sUserActivate(user._id, (err, nuser) => {
                    if (err) {
                        res.status(500);
                        res.json({
                            data: '',
                            success: false,
                            msg: 'Faild to active'
                        })
                    } else {
                        emailService.sendmailPatientVerification(user, () => {});
                        res.json({
                            data: user,
                            success: true,
                            msg: 'user active',
                        })
                        io.emit('check-user');
                    }
                })

            } else {
                res.status(500);
                return res.json({
                    data: err,
                    success: false,
                    msg: 'user not found'
                });
            }
        }
    })
});

router.post('/removePatient', (req, res) => {
    const io = req.app.get('io');
    let email = req.body.email;
    User.getUserBYEmail(email, (err, user) => {
        if (err) {
            res.status(500);
            return res.json({
                data: err,
                success: false,
                msg: 'user not found'
            });
        } else {
            if (!user) {
                res.status(500);
                return res.json({
                    data: err,
                    success: false,
                    msg: 'user not found'
                });
            } else if (user.role == 'patient') {
                User.deleteUserById(user._id, (err, user) => {
                    if (err) {
                        res.status(500);
                        res.json({
                            data: '',
                            success: false,
                            msg: 'Faild to remove'
                        })
                    } else {
                        Patient.deletePatientByEmail(user.email,(err, user) => {
                            if (err) {
                                res.status(500);
                                res.json({
                                    data: '',
                                    success: false,
                                    msg: 'Faild to remove'
                                })
                            } else {
                                res.json({
                                    data: user,
                                    success: true,
                                    msg: 'user remove',
                                })
                                io.emit('check-user');
                            }
                        })
                    }
                })

            } else {
                res.status(500);
                return res.json({
                    data: err,
                    success: false,
                    msg: 'user not found'
                });
            }
        }
    })
});



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

router.post('/changePassword', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const io = req.app.get('io');
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress

    z = ['112.135.14.4', '112.134.15.8', '112.134.56.6', '112.135.250.50', '220.247.224.55', '61.245.163.70', '112.134.235.161']
    // ip = z[Math.floor(Math.random() * z.length)]
        ip = '112.134.56.6'

    User.getUserBYEmail(req.body.email, (err, user) => {
                if (err) {
                    res.status(500);
                    return res.json({
                        data: err,
                        success: false,
                        msg: 'err'
                    });
                } else {
                    ipapi.location((data) => {
                        User.activate(user._id, req.body.password,ip , data.city, (err, user) => {
                            if (err) {
                                res.status(500);
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
                                io.emit('check-user');
                            }
                        })
                    },ip)
                }
            });
})

router.get('/validate', (req, res) => {
    res.send('validate')
})




router.post('/profileChanePassword', passport.authenticate('jwt', {
            session: false
        }), (req, res) => {
     User.getUserBYEmail(req.body.email, (err, user) => {
         if (err) {
             res.status(500);
             return res.json({
                 data: err,
                 success: false,
                 msg: 'err'
             });
         } else {
             User.comparePassword(req.body.oldPassword, user.password, (err, isMatch) => {
                 if(isMatch){
                    User.activate2(user._id, req.body.password, (err, user) => {
                        if (err) {
                            res.status(500);
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
                 } else {
                    res.status(500);
                    res.json({
                        data: '',
                        success: false,
                        msg: 'old Password not match'
                    })
                 }
             })
             
         }
     });
})

router.post('/temporarydisable', (req, res) => {
    const io = req.app.get('io');
    User.temporyBan(req.body.email,req.body.val, (err,user) => {
        if(err){
            res.json({
                data: err,
                success: false,
                msg: 'failed update the email',
            })
        } else {
            Ip.temporyBan(req.body.email, req.body.val, (err, ip) => {
                if(err){
                    res.json({
                        data: err,
                        success: false,
                        msg: 'failed update the email',
                    })
                } else {
                    res.json({
                        data: user,
                        success: true,
                        msg: 'update the email',
                    })
                    io.emit('check-user');
                }
            })
        }
    })
})

// Get All Users
router.route('/').get((req, res) => {
  const io = req.app.get('io');
  User.getAll((err, user) => {
    if (err) {
      res.status(500);
      res.json({
        data: '',
        success: false,
        msg: 'Failed to get users'
      })
    } else {
      res.json({
        data: user,
        success: true,
        msg: 'got users',
      })
    }
  })
})

//Delete a User
router.delete('/delete/:id', (req, res) => {
  const io = req.app.get('io');
  console.log(req.params.id);

  Salon.deleteUserById(req.params.id, (err, salon) => {
    if (err) {
      res.status(500);
      res.json({
        data: err,
        success: false,
        msg: 'Failed to delete the user',
      });
    } else {
      res.json({
        data: salon,
        success: true,
        msg: 'user deleted',
      });
      io.emit('check-user');
      io.emit('delete-user');
    }
  });
});

//example
router.post('/register', (req, res) => {
    const io = req.app.get('io');
    let user = User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        email: req.body.email,
    })
    User.register(user, nuser, (err, user) => {
        if (err) {
            res.status(500);
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
            io.emit('check-user');
        }
    })
})

//
router.post('/getip/:email',(req,res)=>{
    Ip.blockEmail(req.params.email, (err,ips)=>{
        if(err){
            res.json({
                data: err,
                success: false,
                msg: 'Faild to get ips'
            })
        } else {
            res.json({
                data: ips,
                success: true,
                msg: 'got ips'
            })
        }
    })
})

router.get('/get', (req, res) => {
    Ip.get((err, ips) => {
        if (err) {
            res.json({
                data: err,
                success: false,
                msg: 'Faild to get ips'
            })
        } else {
            res.json({
                data: ips,
                success: true,
                msg: 'got ips'
            })
        }
    })
})


// router.post('/addip', (req, res) => {
//     let ip = '112.135.56.6'
//     let nuser = {
//         email: 'syncdonor@gmail.com',
//         registerIp: ip,
//         userType: 'donor'
//     }
//     console.log(ip)

//     ipapi.location((data) => {
//                 console.log(data)
//                 let newIP = new Ip({
//                     ipv4: ip,
//                     fingerprint: 5405405887,
//                     city: data.city,
//                     region: data.region,
//                     country: data.country,
//                     userType: ['admin'],
//                     users: [nuser],
//                 })
//                 Ip.addIp(newIP, (err, ip) => {
//                     if (err) {
//                         res.json({
//                             data: err,
//                             success: false,
//                             msg: 'Faild to get ips'
//                         })
//                     } else {
//                         res.json({
//                             data: ip,
//                             success: true,
//                             msg: 'got ips'
//                         })
//                     }
//                 })
//             },ip)

    
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