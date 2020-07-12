const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// subcribe schema
const SubcribeSchema = mongoose.Schema({
    sub: {
        endpoint: {
            type: String,
        },
        expirationTime: {
            type: String,
            default: null
        },
        keys: {
            p256dh: {
                type: String,
            },
            auth: {
                type: String,
            }
        }
    },
    role: {
        type: String,
    }
});



const Subcribe = module.exports = mongoose.model('Subcribe', SubcribeSchema);

module.exports.addSubcribe = function (newSubcribe, callback) {
     Subcribe.count({ sub: newSubcribe.sub , role : newSubcribe.role }, function (err, count) {
         if (count == 0) {
            newSubcribe.save(callback);
         } else {
             callback(null, null);
         }
        });
}

//Subcribe get all
module.exports.getAll = function (callback) {

    Subcribe.find(callback);
}


module.exports.getDonor = function (callback) {

    Subcribe.find({role:'donor'},callback);
}

module.exports.getPatient = function (callback) {

    Subcribe.find({role:'patient'},callback);
}

module.exports.getSalon = function (callback) {

    Subcribe.find({role:'salon'},callback);
}

module.exports.getDriver = function (callback) {

    Subcribe.find({role:'driver'},callback);
}

module.exports.getManager = function (callback) {

    Subcribe.find({role:'manager'},callback);
}

module.exports.getAttendant = function (callback) {

    Subcribe.find({role:'attendant'},callback);
}

