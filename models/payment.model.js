const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
    items:  {
        type: String,
        default: "Hair donation",
    },
    amount:  {
        type: String,
        default: '70',
        required: true
    },
    currency:  {
        type: String,
        default: "LKR",
        required: true
    },
    first_name:  {
        type: String,
        default: '',
    },
    last_name:  {
        type: String,
    },
    email:  {
        type: String,
    },
    phone:  {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
});

module.exports = mongoose.model('Donation', donationSchema);
