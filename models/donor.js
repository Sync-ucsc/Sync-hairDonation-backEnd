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
        required: true,
        unique: true
    },
    telePhone: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    fingerprint: {
        type: Number,
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
        requestId: {
            type: Number,
            required: true
        },
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
        canceled: {
            type: Boolean
        },



    }]
});

const Donor = module.exports = mongoose.model('Donor', DonorSchema);

module.exports.addDonor = function (newDonor, callback) {
    
    newDonor.save(callback);
}
