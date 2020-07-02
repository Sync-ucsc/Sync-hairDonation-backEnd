const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Patient = require('../models/patient');
const User = require('../models/user');
const {sendResponse} = require('../utils/response.utils');

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
        res.json({
          data: patient,
          success: true,
          msg: 'got wig requets',
        })
      }
    })
  })

  module.exports = router;