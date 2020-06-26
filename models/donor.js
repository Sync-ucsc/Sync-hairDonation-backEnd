const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// donor schema
const DonorSchema = mongoose.Schema({
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
    nearSalon: {
        salon: {
            type: String,
        },
        id: {
            type: Number,
        },
        distance: Number

    },
    request: [{
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
            type: Boolean
        },
        canceled: {
            type: Boolean
        },



    }]
});



const Donor = module.exports = mongoose.model('Donor', DonorSchema);

module.exports.addDonor = function (newDonor, callback) {
    
    newDonor.save(callback);
}

module.exports.addDonorRequest = function(email,req,callback){

    const query =  { email: email};
    Donor.findOneAndUpdate(query,{ $push: { request: req }},callback);
}

//Donor get all
module.exports.getAll = function (callback) {

    Donor.find(callback);
}

//Donor get by id
module.exports.getById = function (id, callback) {

    Donor.findById(id, callback);
}

//Donor salon
module.exports.updateDonor = function (updatedDonor, callback) {


    Donor.findByIdAndUpdate(updatedDonor._id, {
        $set: updatedDonor
    }, {
        useFindAndModify: false
    },
        callback);
}
//Donor delete
module.exports.deleteDonor = function (id, callback) {
    console.log('deleted Donor')
    Donor.findByIdAndDelete(id, callback);
}