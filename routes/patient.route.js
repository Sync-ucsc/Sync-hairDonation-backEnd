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

        patient.forEach( p => {
            const lastRequest = p.request.sort((a, b) => sharedService.sortByDate(a.requestDay, b.requestDay))[0];
            wigrequest.push({
                lastRequest,
                firstName: p.firstName,
                lastName: p.lastName,
                id: p.id,
                reportId: p.patientNumber
            })
        })
        // array.forEach(element => {
        //     element.request.sort((a, b) => sharedService.sortByDate(a.requestDay, b.requestDay))[0];

        // });
        res.json({
          data: wigrequest,
          success: true,
          msg: 'got wig requets',
        })
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


  module.exports = router;