const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

const EmailService = require('../services/email.service');
const emailService = new EmailService();


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
        required: true,
        unique: true
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
    block:{
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean
    }
});

const User = module.exports = mongoose.model('User',UserSchema);

//Get all users
module.exports.getAll = function (callback) {

    User.find(callback);
}

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

module.exports.register = function(user,callback){
    let randome = Math.floor(Math.random() * Math.floor(1000000))
    console.log(randome)
    let newUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        temporyBan: false,
        active: false,
        password: randome,
    })
    
    emailService.sendmailRegistation(newUser, randome,()=> {});
    User.addUser(newUser,callback); 
}

module.exports.activate = function(id,password,callback){
    bcrpt.genSalt(10, (err, salt) => {
        if (err) {
            throw err;
        }
        bcrpt.hash(password, salt, (err, hash) => {
            if (err)
                throw err;
            //password = hash;
           
            User.findByIdAndUpdate(id, {
                $set: {
                    password: hash,
                    active: true
                }
            }, (err, res) => {
                // console.log(res)
                callback(null,null);
            })
        })
    })
}

module.exports.sUserActivate = function (id, callback) {
     User.findByIdAndUpdate(id, {
         $set: {
             active: true
         }
     }, (err, res) => {
         // console.log(res)
         callback(null, null);
     })
}

module.exports.deleteUserById = function (id, callback) {
    User.findByIdAndDelete(id, callback);
}