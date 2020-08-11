const mongoose = require(`mongoose`);

//manualRequest schema
const manualRequestSchema = mongoose.Schema({
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
    
    //1=accpet, 2=decline
    attendantStatus: {
        type: Number,
        default: 0,
        required: true
    },

})

const manualRequest = module.exports = mongoose.model('manualRequest', manualRequestSchema);

