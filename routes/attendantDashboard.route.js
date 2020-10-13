const express = require('express');
const router = express.Router();

module.exports = router;

const {sendResponse} = require('../utils/response.utils');

let Attendant = require('../models/attendant');
let Donor = require('../models/donor');
let Patient = require('../models/patient');

router.get('/monthlyDonations', (async (req, res) => {
    try {

        const attendantData = Attendant.find({})

        res.send(sendResponse(attendantData));

    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
}))

router.get('/totalDonors', async (req, res) => {
    try {

        const donorData = await Donor.find({});

        res.send(sendResponse(donorData.length))

    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})

router.get('/totalPatient', async (req, res) => {
    try {

        const patientData = await Patient.find({});

        res.send(sendResponse(patientData))

    } catch (error) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
})
