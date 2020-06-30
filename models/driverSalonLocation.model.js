const mongoose = require('mongoose');

// status COLLECTED , NOT_COLLECTED

const location = mongoose.Schema({
    lat: {
        type: String,
        required: true
    },
    lng: {
        type: String,
        required: true
    },
    noOfWigs: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'NOT_COLLECTED',
        required: true
    },
});

const driverSalonLocationSchema = mongoose.Schema({
    driverId: {
        type: String,
        required: true
    },
    driverEmail: {
        type: String,
        required: true
    },
    locations: [location],
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    status: {
        type: String,
        default: 'NOT_COLLECTED',
        required: true
    },
});

module.exports = mongoose.model('driverSalonLocation', driverSalonLocationSchema);
