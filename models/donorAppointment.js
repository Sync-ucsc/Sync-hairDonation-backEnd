const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// donor schema
const DonorAppoitmentSchema = mongoose.Schema({
    salonEmail: {
        type: String,
        required: true
    },
    DonorRequest:{
        type: Boolean,
        required: true,
    },
    Donoremail: {
        type: String
    },
    customerEmail: {
        type: String
    },
    customerNumber: {
        type: String
    },
    customerName: {
        type: String
    },
    systemRequestDate: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true
    },
    appointmentTimeSlot: {
        type: Number,
        required: true
    },
    progress: {
        type: Number
    },
    canceled: {
        type: Boolean,
    }
});
