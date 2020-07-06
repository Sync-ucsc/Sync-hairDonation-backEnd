const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// donor schema
const DonorAppoitmentSchema = mongoose.Schema({
    salonEmail: {
        type: String,
        required: true
    },
    DonorRequest:{
        type: Boolean,
        required: true,
    },
    Donoremail: {
        type: String
    },
    customerEmail: {
        type: String
    },
    customerNumber: {
        type: String
    },
    customerName: {
        type: String
    },
    systemRequestDate: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true
    },
    appointmentTimeSlot: {
        type: Number,
        required: true
    },
    //1-donor accept 2-donor decline 3-salon accept 4-salon decline 5-?
    progress: {
        type: Number
    },
    canceled: {
        type: Boolean,
        default:false,
        reqired:true
    }
});


const DonorAppoitment = module.exports = mongoose.model('DonorAppointment', DonorAppointmentSchema)




//Appointment add
module.exports.addDonorAppointment = function (newDonorAppointment, callback) {
    newDonorAppointment.save(callback);
}



//Appointment get by id
module.exports.getById = function (id, callback) {

    DonorAppoitment.findById(id, callback);
}


//update appointment
module.exports.updateDonorAppointment = function (updatedDonorAppointment, callback) {


    DonorAppoitment.findByIdAndUpdate(updatedDonorAppointment._id, {
        $set: updatedDonorAppointment
    }, {
        useFindAndModify: false
    },
        callback);
}

//Appointment delete
module.exports.deleteDonateAppointmentById = function (id, callback) {
    console.log('dx')
    DonorAppoitment.findByIdAndDelete(id,callback);
}
