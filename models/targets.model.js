const mongoose = require('mongoose');

// status COLLECTED , NOT_COLLECTED

const targetSalonLocationsSchema = mongoose.Schema({
    salonId: {
        type: String,
        required: true,
    },
    salonName: {
        type: String,
        required: true
    },
    salonEmail: {
        type: String,
        required: true
    },
    requestId: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    noOfWigs: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'NeedToDeliver', // NeedToDeliver | Delivered  | Cancel,
        required: true
    },
    notification: {
        type: String,
        default: ''
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
});

const targetsSchema = mongoose.Schema({
    driverId: {
        type: String,
        required: true
    },
    driverEmail: {
        type: String,
        required: true
    },
    targets: [targetSalonLocationsSchema],
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
    notification: {
        type: String,
        default: ''
    }
});

const targetSalonLocations = mongoose.model('location', targetSalonLocationsSchema)
const targets = mongoose.model('targets', targetsSchema);

module.exports = {
    targetSalonLocations: targetSalonLocations,
    targets: targets,
}

// sample json
// {
//     "driverId": "aka",
//     "driverEmail": "aka@gmail.com",
//     "targets": [
//     {
//         "salonId": "5efa17b13fb5183cc8c348da",
//         "requestId": "5efa17b13fb5183cc8c8e8da",
//         "lat": 6.904784,
//         "lng": 79.862619,
//         "noOfWigs": 14,
//         "status": "NeedToDeliver"
//     },
//     {
//         "salonId": "5efa17b13fb5181cc8c348da",
//         "requestId": "5efa10b13fb5183cc8c8e8da",
//         "lat": 6.89588,
//         "lng": 79.856985,
//         "noOfWigs": 20,
//         "status": "NeedToDeliver"
//     },
//     {
//         "salonId": "5efa17b13fb5181cc8c348da",
//         "requestId": "5efa10b13fb5183cc8c8e8da",
//         "lat": 6.878071,
//         "lng": 79.875358,
//         "noOfWigs": 16,
//         "status": "NeedToDeliver"
//     }
// ],
//     "createdAt": "2020-06-25T00:00:00.000Z",
//     "status": "NOT_COMPLETED"
// }
