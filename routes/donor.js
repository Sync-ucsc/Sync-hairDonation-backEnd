const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Donor = require('../models/donor');
const User = require('../models/user');
const {sendResponse} = require('../utils/response.utils');



// Donor request
router.post('/addDonorRequest', (req, res) => {
    
    let request = {
        requestDay: req.body.requestDay,
        validDate : req.body.validDate,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        finished: false,
        canceled: false
    }

  
    Donor.addDonorRequest(req.body.email,request, req.body.selectedSalon, req.body.district,(err,donor)=>{
        if (err) {
          console.log(err)
          console.log(`error`)
          res.status(500);
            res.json({
                data: err,
                success: false,
                msg: 'Faild to add donor requset'
            })
        } else {
            console.log(donor)
            console.log(`success`)
            res.json({
                data: donor,
                success: true,
                msg: 'Donor request added',
            })

        }
    })
})

// change location
router.post('/changeLocation', (req, res) => {
  Donor.changeLocation(req.body.lat,req.body.lon,req.body.email,(err,donor)=>{
        if (err) {
          res.status(500);
            res.json({
                data: err,
                success: false,
                msg: 'Faild to change location'
            })
        } else {
            res.json({
                data: donor,
                success: true,
                msg: 'Donor location change',
            })

        }
    })
})

// Get All Donors
router.get('/', (req, res) => {
    const io = req.app.get('io');
    Donor.getAll((err, donor) => {
      if (err) {
        res.status(500);
        res.json({
          data: '',
          success: false,
          msg: 'Failed to get donors'
        })
      } else {
        res.json({
          data: donor,
          success: true,
          msg: 'got donors',
        })
      }
  })
})
  
  
// Get a single donor
router.get('/read/:id', (req, res) => {
    const io = req.app.get('io');
    Donor.getById(req.params.id, (err,donor) => {
      if (err) {
        res.status(500);
        res.json({
          data: '',
          success: false,
          msg: 'Failed to get the donor'
        })
      } else {
        res.json({
          data: donor,
          success: true,
          msg: 'got the donor',
        })
      }
    })
})

// Get a single donor by email
  router.get('/getDonor/:email', (req, res) => {
      const io = req.app.get('io');
      Donor.getDonorByEmail(req.params.email, (err,donor) => {
        if (err) {
          res.status(500);
          res.json({
            data: 'err',
            success: false,
            msg: 'Failed to get the donor'
          })
        } else {
          res.json({
            data: donor,
            success: true,
            msg: 'got the donor',
          })
        }
      })
})
    
// Update donor
  router.post('/update/:id', (req, res) => {
    const io = req.app.get('io');
    let updatedDonor = Donor({
      _id: req.params.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      telePhone: req.body.telePhone,
      address: req.body.address,
      nic:req.body.nic,
      lat: req.body.lat,
      lon: req.body.lon,
    //   checkSystem: req.body.checkSystem,
    //   checkSms: req.body.checkSms,
    //   checkEmail: req.body.checkEmail,
    })
  
    Donor.updateDonor(updatedDonor, (err, donor) => {
      if (err) {
        res.status(500);
        res.json({
          data: err,
          success: false,
          msg: 'Failed to update donor'
        })
      } else {
        res.json({
          data: donor,
          success: true,
          msg: 'updated donor',
        })
        io.emit('update-donor');
  
      }
  
      
    })
  
  
  })
  
// Delete Donor
  router.delete('/delete/:id', (req, res) => {
    const io = req.app.get('io');
    console.log(req.params.id)
  
    Donor.deleteDonor(req.params.id, (err, donor) => {
      if (err) {
        res.status(500);
        res.json({
          data: err,
          success: false,
          msg: 'Failed to delete the donor'
        })
      } else {
        res.json({
          data: donor,
          success: true,
          msg: 'Donor deleted',
        })
        io.emit('check-user');
        io.emit('delete-donor');
      }
    });
  
  })


// login


// authenticate


// validate

// check Fingerprint


// profile

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