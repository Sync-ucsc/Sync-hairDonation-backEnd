const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

const Ipchema = mongoose.Schema({
    ipv4: {
        type: String,
        required: true,
        unique: true
    },
    fingerprint:{
        type: Number,
    },
    city: {
        type: String,
    },
    region: {
        type: String,
    },
    country: {
        type: String,
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
    }]

});


const Ip = module.exports = mongoose.model('Ip', Ipchema);

module.exports.addIp = function (newIp, user, role, callback) {

     Ip.count({ ipv4: newIp.ipv4 }, function (err, count) {
         if (count > 0) {
             Ip.findOneAndUpdate({ ipv4: newIp.ipv4}, {
                 $push: {
                     users: user,
                      userType: role,
                 },
                 
             }, callback);
         }
         else {
            newIp.save(callback);
         }
     });
}

module.exports.editFingerprint = function (fingerprint, user, role, callback) {

    const query = {
        Fingerprint: fingerprint
    };
    Fingerprint.findOneAndUpdate(query, {
        $push: {
            users: user,
            userType: role
        }
    }, callback);
}