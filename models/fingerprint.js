const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

const FingerprintSchema = mongoose.Schema({
    Fingerprint: {
        type: String,
        required: true,
        unique: true
    },
    userType: [{
        type: String
    }],
    users: [{
        email: {
            type: String
        },
        registerIp: {
            type: String
        },
        city: {
            type: String
        },
        userType: {
            type: String
        },
        temporyBan: {
            type: Boolean,
            default: false,
        }

        
    }],
    block: {
        type: Boolean,
        default: false
    },
    check: {
        type: Boolean,
        default: false
    }


});


const Fingerprint = module.exports = mongoose.model('Fingerprint', FingerprintSchema);

module.exports.addFingerprint = function(newFingerprint,callback){

    newFingerprint.save(callback);
}

module.exports.getFingerprint = function(fingerprint,callback){
    
    const query = { Fingerprint: fingerprint};
    Fingerprint.findOne(query,callback);
}

module.exports.getAllUnusalFingerprint = function(callback){
    const query = {
            "users.1": {
                "$exists": true
            }
        };
    Fingerprint.find(query,callback);
}

module.exports.editFingerprint = function(fingerprint,user,role,callback){

    const query =  { Fingerprint: fingerprint};
    Fingerprint.findOneAndUpdate(query, {
        $push: {
            users: user,
            userType: role
        }
    }, callback);
}

module.exports.blockFingerprint = function (fingerprint,callback) {

    const query =  { Fingerprint: fingerprint};
    Fingerprint.findOneAndUpdate(query,{block : true,check: false},callback);

}

module.exports.checkFingerprint = function (fingerprint,callback){

     const query =  { Fingerprint: fingerprint};
    Fingerprint.findOneAndUpdate(query,{check : true},callback);

}

module.exports.unblockFingerprint = function (fingerprint,callback){
    
    const query =  { Fingerprint: fingerprint};
    Fingerprint.findOneAndUpdate(query,{block : false},callback);

}

module.exports.deleteFingerprintById = function (id, callback) {
    Fingerprint.findByIdAndDelete(id, callback);
}
