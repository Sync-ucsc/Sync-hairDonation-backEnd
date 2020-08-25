const express = require('express');
const router = express.Router();

const selectedSalonService = require('../services/selectedSalon.service');
const SelectedSalonService = new selectedSalonService();

const {sendResponse} = require('../utils/response.utils');

router.get('/select', async (req, res) => {
    try {
        res.send(sendResponse(SelectedSalonService.selectedDonor()))
    } catch (err) {
        res.send(sendResponse(undefined, false, error.toString()))
    }
});


module.exports = router;
