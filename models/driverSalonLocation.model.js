const mongoose = require('mongoose');

// status COLLECTED , NOT_COLLECTED

const locationSchema = mongoose.Schema({
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
    locations: [locationSchema],
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    status: {
        type: String,
        default: 'NOT_COMPLETED',
        required: true
    },
});

const location = mongoose.model('location', locationSchema)
const driverSalonLocation = mongoose.model('driverSalonLocation', driverSalonLocationSchema);

module.exports = {
    location: location,
    driverSalonLocation: driverSalonLocation,
}
