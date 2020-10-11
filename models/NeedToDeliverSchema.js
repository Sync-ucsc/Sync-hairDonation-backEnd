const mongoose = require('mongoose');

const NeedToDeliverSchema = module.exports  = new mongoose.Schema({
    requestId: {
        type: Number,
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
    wigCount: {
        type: Number,
        default: 1,
        required: true
    },
    deliveryDate: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

const NeedToDeliver = module.exports = mongoose.model('NeedToDeliver', NeedToDeliverSchema);
