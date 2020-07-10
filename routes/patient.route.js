const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Patient = require('../models/patient');
const User = require('../models/user');
const {sendResponse} = require('../utils/response.utils');

const SharedService = require('../services/shared.service')
const sharedService = new SharedService();

// Get All Patients
router.get('/', (req, res) => {
    const io = req.app.get('io');
    Patient.getAll((err, patient) => {
      if (err) {
        console.log(err);
        res.status(500);
        res.json({
          data: 'err',
          success: false,
          msg: 'Failed to get patients wig request'
        })
      } else {
        const wigrequest = [];
        //get the last wig request of the patient
        patient.forEach( p => {
            const lastRequest = p.request.sort((a, b) => sharedService.sortByDate(a.requestDay, b.requestDay))[0];
            wigrequest.push({
                lastRequest,
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                telePhone: p.telePhone,
                address: p.address,
                nic: p.nic,
                // lat: p.lat,
                // lon: p.lon,
                reportId: p.patientNumber
            })
        })
        res.json({
          data: wigrequest,
          success: true,
          msg: 'got wig requets',
        })
      }
    })
  })

// Get a single patient
router.get('/read/:id', (req, res) => {
  const io = req.app.get('io');
  Patient.getById(req.params.id, (err, patient) => {
    if (err) {
      res.status(500);
      res.json({
        data: '',
        success: false,
        msg: 'Failed to get the patient'
      })
    } else {
      res.json({
        data: patient,
        success: true,
        msg: 'got the patient',
      })
    }
  })
})

//Get patient by E-mail
router.get('/readByEmail/:email',(req,res)=>{
  Patient.getByEmail(req.params.email, (err, patient) => {
    if (err) {
      res.status(500);
      res.json({
        data: '',
        success: false,
        msg: 'Failed to get the patient'
      })
    } else {
      res.json({
        data: patient,
        success: true,
        msg: 'got the patient',
      })
    }
  })
})

// Update patient
router.post('/update/:id', (req, res) => {
  const io = req.app.get('io');
  let updatedPatient = Patient({
    _id: req.params.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    telePhone: req.body.telePhone,
    address: req.body.address,
    nic:req.body.nic,
    // lat: req.body.lat,
    // lon: req.body.lon,
  //   checkSystem: req.body.checkSystem,
  //   checkSms: req.body.checkSms,
  //   checkEmail: req.body.checkEmail,
  })

  Patient.updatePatient(updatedPatient, (err, patient) => {
    if (err) {
      res.status(500);
      res.json({
        data: err,
        success: false,
        msg: 'Failed to update patient'
      })
    } else {
      res.json({
        data: patient,
        success: true,
        msg: 'updated patient',
      })
      io.emit('update-patient');

    }

    
  })


})

// Delete patient
router.delete('/delete/:id', (req, res) => {
  const io = req.app.get('io');
  console.log(req.params.id)

  Patient.deletePatient(req.params.id, (err, patient) => {
    if (err) {
      res.status(500);
      res.json({
        data: err,
        success: false,
        msg: 'Failed to delete the patient'
      })
    } else {
      res.json({
        data: patient,
        success: true,
        msg: 'patient deleted',
      })
      io.emit('delete-patient');
    }
  });

})

module.exports = router;