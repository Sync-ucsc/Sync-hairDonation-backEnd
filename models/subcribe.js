const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// wigRequest
const wigRequest = require(`./wigRequest.model`);

// subcribe schema
const SubcribeSchema = mongoose.Schema({
    
});



const Subcribe = module.exports = mongoose.model('Subcribe', SubcribeSchema);

module.exports.addSubcribe = function (newSubcribe, callback) {

    newSubcribe.save(callback);
}

module.exports.addSubcribeRequest = function (email, req, callback) {

    const query = {
        email: email
    };
    Subcribe.findOneAndUpdate(query, {
        $push: {
            request: req
        }
    }, callback);
}

//Subcribe get all
module.exports.getAll = function (callback) {

    Subcribe.find(callback);
}
