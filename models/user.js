const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// user schema
const UserSchema = mongoose.Schema({
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
    role:{
        type: String,
        required: true
    },
    temporyBan:{
        type: Boolean,
    },
    banAction:[{
        type: String,
    }],
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User',UserSchema);

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
        bcrpt.hash(newUser.password, salt,(err,hash)=>{
            if(err)
                throw err;
            newUser.password = hash;
            newUser.save(callback)
        })
    })
}

module.exports.comparePassword = function(candidateToken,hash,callback){
    bcrpt.compare(candidateToken,hash, (err,isMatch)=>{
        if( err){
            throw err;
        }
        callback(null,isMatch);
    })
}