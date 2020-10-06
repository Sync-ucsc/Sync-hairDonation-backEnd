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
    nic: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    fingerprint: {
        type: Number,
        required: true
    },
    district:{
        type: String
    },
    nearSalon: [
        {

        }

    ],
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
            type: Boolean,
            default: false,
            required: true
        },
        canceled: {
            type: Boolean,
            default: false,
            required: true
        },



    }]
});



const Donor = module.exports = mongoose.model('Donor', DonorSchema);

//Donor add
module.exports.addDonor = function (newDonor, callback) {
    
    newDonor.save(callback);
}

//Donation request add
module.exports.addDonorRequest = function(email,request,selectedSalon,district,callback){

    const query =  { email: email};
    
    Donor.findOneAndUpdate(query,{ 
        district: district,
        $push: { request: request }
        // ,
        // $push: { nearSalon: selectedSalon }
    },callback);

}

//Donor get all
module.exports.getAll = function (callback) {

    Donor.find(callback);
}

//Donor get by id
module.exports.getById = function (id, callback) {

    Donor.findById(id, callback);
}

//Donor get by email
module.exports.getDonorByEmail = function (email, callback) {
    const query =  { email: email};
    Donor.findOne(query, callback);
}

//Donor update
module.exports.updateDonor = function (updatedDonor, callback) {


    Donor.findByIdAndUpdate(updatedDonor._id, {
        $set: updatedDonor
    }, {
        useFindAndModify: false
    },
        callback);
}

//Donor Location cahnge
module.exports.changeLocation = function (lat,lon,email, callback) {


    Donor.findOneAndUpdate({email:email}, {
            $set: {
                lat: lat,
                lon: lon
            }
            }, (err, res) => {
                // console.log(res)
                callback(null, null);
            });
}

module.exports.changeNearSalon = function (selectedSalon,email, callback) {

    Donor.findOneAndUpdate({email:email}, {
            $set: {
                nearSalon: selectedSalon
            }
            }, (err, res) => {
                // console.log(res)
                callback(null, null);
            });
}

//Donor delete
module.exports.deleteDonor = function (id, callback) {
    Donor.findByIdAndDelete(id, callback);
}

module.exports.profileChange = function (email, firstName, lastName, phone, img, address, callback) {
    Donor.findOneAndUpdate({ email: email }, {
        $set: {
            firstName: firstName,
            lastName: lastName,
            telephone: phone,
            address: address
        }
    }, (err, res) => {
        callback(err, res);
    })
}