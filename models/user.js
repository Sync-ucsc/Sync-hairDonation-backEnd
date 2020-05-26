const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// user schema
const UserSchhema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User',UserSchhema);

module.exports.getUserById = function(id, callback){
    User.findById(id,callback);
}

module.exports.getUserBYEmail = function(email,callback){
    const query = {email : email};
    User.findOne(query,callback);
}

module.exports.addUser = function(newUser,callback){
    bcrpt.genSalt(10,(err,salt)=>{
        if(err){
            throw err;
        }
        bcrpt.hash(newUser.token, salt,(err,hash)=>{
            if(err)
                throw err;
            newUser.token = hash;
            newUser.save(callback)
        })
    })
}

module.exports.compareToken = function(candidateToken,hash,callback){
    bcrpt.compare(candidateToken,hash, (err,isMatch)=>{
        if( err){
            throw err;
        }
        callback(null,isMatch);
    })
}