const mongoose = require('mongoose');

const NeedToDeliverSchema = module.exports  = new mongoose.Schema({
    salonId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'NeedToDeliver', // NeedToDeliver | Delivered | Cancel
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    deliveryDate: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

const NeedToDeliver = module.exports = mongoose.model('NeedToDeliver', NeedToDeliverSchema);
