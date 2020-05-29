const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// donor schema
const DonorSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    telePhone: {
        type: String,
        required: true
    },
    nearSalon: {
        salon: {
            type: String,
        },
        id: {
            type: Number,
        },
        distance: Number

    },
    request: [{
        requestDay: {
            type: Date
        },
        validDate: {
            type: Date
        },
        appoiment: [{

        }],
        finished: {
            type: Boolean
        },


    }]
});

const User = module.exports = mongoose.model('Donor', DonorSchema);