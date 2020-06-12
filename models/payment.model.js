const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
    donor: {
        type: String,
        // required: true
    },
    amount: {
        type: String,
        // required: true
    },
    message: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
});

module.exports = mongoose.model('Donation', donationSchema);
