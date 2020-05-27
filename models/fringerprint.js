const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

const FringerprintSchhema = mongoose.Schema({
    fringerprint: {
        type: String,
        required: true
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
        userType: {
            type: String
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


const Fringerprint = module.exports = mongoose.model('Fringerprint', FringerprintSchhema);

module.exports.addFringerprint = function(newFringerprint,callback){

    newFringerprint.save(callback);
}

module.exports.getFringerprint = function(fringerprint,callback){
    
    const query = { fringerprint: fringerprint};
    Fringerprint.findOne(query,callback);
}

module.exports.getAllUnusalFringerprint = function(callback){
    const query = {
            "users.1": {
                "$exists": true
            }
        };
    Fringerprint.find(query,callback);
}

module.exports.editFringerprint = function(fringerprint,user,callback){

     const query =  { fringerprint: fringerprint};
    Fringerprint.findOneAndUpdate(query,{ $push: { users: user }},callback);
}

module.exports.blockFringerprint = function (fringerprint,callback) {

    const query =  { fringerprint: fringerprint};
    Fringerprint.findOneAndUpdate(query,{block : true},callback);

}

module.exports.checkFringerprint = function (fringerprint,callback){

     const query =  { fringerprint: fringerprint};
    Fringerprint.findOneAndUpdate(query,{check : true},callback);

}

module.exports.unblockFringerprint = function (fringerprint,callback){
    
    const query =  { fringerprint: fringerprint};
    Fringerprint.findOneAndUpdate(query,{block : false},callback);

}

