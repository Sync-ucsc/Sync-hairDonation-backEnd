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


//signup

router.post('/signup', (req,res) => {

    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress

    ip = '112.135.14.4'


    

    if (req.body.role == 'donor' || req.body.role == 'patient'){
        let newUser = new User({
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            role: req.body.role,
            temporyBan: false,
            active: false,
            password: req.body.password
        })

        let nuser = {
            email: req.body.email,
            registerIp: ip,
            userType: req.body.role
        }
        let newDonor = new Donor({
                firstName: req.body.fname,
                lastName: req.body.lname,
                email: req.body.email,
                telePhone: req.body.phone,
                nic:req.body.nic,
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
                if (req.body.role == 'patient'){
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
                                Fingerprint.addFingerprint(fingerprint, (err, fingerprint) => {
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
                                        ipapi.location((data) => {
                                            let newIP = new Ip({
                                                ipv4: ip,
                                                fingerprint: req.body.fingerprint,
                                                city: data.city,
                                                region: data.region,
                                                country: data.country,
                                                userType: [req.body.role],
                                                users: [nuser],
                                            })
                                            Ip.addIp(newIP, nuser, 'patient', (err, fingerprint) => {
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
                                                            fingerprint: fingerprint
                                                        },
                                                        success: true,
                                                        msg: 'User registere',
                                                    })
                                                }
                                            });
                                        }, ip)



                                    }
                                })
                            } else if (req.body.fpcount == 1) {
                                Fingerprint.editFingerprint(req.body.fingerprint, nuser, 'patient', (err, fingerprint) => {
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
                                        Fingerprint.blockFingerprint(req.body.fingerprint, (err, fingerprint) => {
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
                                                ipapi.location((data) => {
                                                    let newIP = new Ip({
                                                        ipv4: ip,
                                                        fingerprint: req.body.fingerprint,
                                                        city: data.city,
                                                        region: data.region,
                                                        country: data.country,
                                                        userType: [req.body.role],
                                                        users: [nuser],
                                                    })
                                                    Ip.addIp(newIP, nuser, 'patient', (err, fingerprint) => {
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
                                                                    fingerprint: fingerprint
                                                                },
                                                                success: true,
                                                                msg: 'User registere',
                                                            })
                                                        }
                                                    });
                                                }, ip)


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
                            User.deleteUserById(user._id,(err,dd)=>{});
                            res.json({
                                data: err,
                                success: false,
                                msg: 'Faild to register user'
                            })
                            
                          } else {
                                if(req.body.fpcount == 0) {
                                    Fingerprint.addFingerprint(fingerprint, (err, fingerprint) => {
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
                                            ipapi.location((data)=>{
                                                let newIP = new Ip({
                                                    ipv4: ip,
                                                    fingerprint: req.body.fingerprint,
                                                    city: data.city,
                                                    region: data.region,
                                                    country: data.country,
                                                    userType: [req.body.role],
                                                    users: [nuser],
                                                })
                                                Ip.addIp(newIP, nuser, 'donor', (err, fingerprint) => {
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
                                                                fingerprint: fingerprint
                                                            },
                                                            success: true,
                                                            msg: 'User registere',
                                                        })
                                                    }
                                                });
                                            }, ip)
                                            
                                            
                                            
                                        }
                                    })
                                } else if (req.body.fpcount == 1) {
                                    Fingerprint.editFingerprint(req.body.fingerprint,nuser,'donor',(err,fingerprint) => {
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
                                            Fingerprint.blockFingerprint(req.body.fingerprint,(err,fingerprint)=>{
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
                                                    ipapi.location((data) => {
                                                        let newIP = new Ip({
                                                            ipv4: ip,
                                                            fingerprint: req.body.fingerprint,
                                                            city: data.city,
                                                            region: data.region,
                                                            country: data.country,
                                                            userType: [req.body.role],
                                                            users: [nuser],
                                                        })
                                                        Ip.addIp(newIP, nuser, 'donor', (err, fingerprint) => {
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
                                                                        fingerprint: fingerprint
                                                                    },
                                                                    success: true,
                                                                    msg: 'User registere',
                                                                })
                                                            }
                                                        });
                                                    },ip)
                                                    
                                                    
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
})

router.post('/authenticate', (req, res) => {
    const email = req.body.email; 
    const password = req.body.password;
    var host = req.app.get('host');
    
   
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
                    res.status(500);
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
                    } else if(user.role == 'donor'){
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

router.post('/request', (req, res) => {
    const email = req.body.email;
    const token = req.body.token;
    var host = req.app.get('host');


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
        if(user.token){
            User.comparePassword(token, user.token, (err, isMatch) => {
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
    User.getUserBYEmail(req.body.email, (err, user) => {
                if (err) {
                    res.status(500);
                    return res.json({
                        data: err,
                        success: false,
                        msg: 'err'
                    });
                } else {
                      User.activate(user._id, req.body.password, (err, user) => {
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
                }
            });
})

router.get('/validate', (req, res) => {
    res.send('validate')
})




router.post('/profileChanePassword', passport.authenticate('jwt', {
            session: false
        }), (req, res) => {
     User.getUserBYEmail(email, (err, user) => {
         if (err) {
             res.status(500);
             return res.json({
                 data: err,
                 success: false,
                 msg: 'err'
             });
         } else {
             if(user.password == req.body.oldPassword){
                 User.activate(user._id, req.body.password, (err, user) => {
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
             }
         }
     });
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
      io.emit('delete-user');
    }
  });
});

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