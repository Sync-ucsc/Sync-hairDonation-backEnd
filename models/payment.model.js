const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
    items:  {
        type: String,
        default: Date.now(),
        required: true
    },
    amount:  {
        type: String,
        default: Date.now(),
        required: true
    },
    currency:  {
        type: String,
        default: Date.now(),
        required: true
    },
    first_name:  {
        type: String,
        default: Date.now(),
        required: true
    },
    last_name:  {
        type: String,
        default: Date.now(),
        required: true
    },
    email:  {
        type: String,
        default: Date.now(),
        required: true
    },
    phone:  {
        type: String,
        default: Date.now(),
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
});

module.exports = mongoose.model('Donation', donationSchema);
