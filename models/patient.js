const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// wigRequest
const wigRequest = require(`./wigRequest.model`);

// patient schema
const PatientSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telePhone: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    patientNumber:{
        type: String
    },
    patientReport: {
        type: String
    },
    fingerprint: {
        type: Number,
        required: true
    },
    request: [wigRequest]
});



const Patient = module.exports = mongoose.model('Patient', PatientSchema);

module.exports.addPatient = function (newPatient, callback) {

    newPatient.save(callback);
}

module.exports.addPatientRequest = function (email, req, callback) {

    const query = {
        email: email
    };
    Patient.findOneAndUpdate(query, {
        $push: {
            request: req
        }
    }, callback);
}

//Patient get all
module.exports.getAll = function (callback) {

    Patient.find(callback);
}

//Patient get by id
module.exports.getById = function (id, callback) {

    Patient.findById(id, callback);
}

//Patient salon
module.exports.updatePatient = function (updatedPatient, callback) {


    Patient.findByIdAndUpdate(updatedPatient._id, {
            $set: updatedPatient
        }, {
            useFindAndModify: false
        },
        callback);
}
//Patient delete
module.exports.deletePatient = function (id, callback) {
    Patient.findByIdAndDelete(id, callback);
}
