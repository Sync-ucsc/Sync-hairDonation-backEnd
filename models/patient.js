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
    request: [{
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
    }]
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
//Patient get by id
module.exports.getById = function (id, callback) {

    Patient.findById(id, callback);
}
module.exports.getPatientByEmail = function (email, callback) {
  const query = {email: email};
  User.findOne(query, callback);
};