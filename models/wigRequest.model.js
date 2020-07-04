const mongoose = require(`mongoose`);

const wigRequestSchema = mongoose.Schema({
    requestId: {
        type: Number,
        required: true
    },
    requestDay: {
        type: Date,
        required: true
    },
    wigType: {
        type: String,
        required: true
    },
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
    //1=accpet, 2=decline
    attendantStatus: {
        type: Number,
        default: 0,
        required: true
    },

})

const wigRequest = module.exports = mongoose.model('wigRequest', wigRequestSchema);

