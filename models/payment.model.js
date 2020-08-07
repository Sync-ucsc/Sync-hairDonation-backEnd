const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    order_id:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    status:{
        type: String, // STARTED , FAILED , COMPLETED
        required: true
    },
    developerMessage:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
});

module.exports = mongoose.model('Donation', donationSchema);
