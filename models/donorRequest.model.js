const mongoose = require(`mongoose`);

const donorRequestSchema = mongoose.Schema({
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
    address: {
        type: String
    },
    latitude:{
        type:Number
    },
    longitude:{
        type:Number
    },
    appoiment: [{

    }],
    finished: {
        type: Boolean,
        default: false,
        required: true
    },
    canceled: {
        type: Boolean,
        default: false,
        required: true
    },
})

const donorRequest = module.exports = mongoose.model('donorRequest', donorRequestSchema);