const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define collection and schema
const SalonSchema = new Schema({
        name: {
            type: String
        },
        email: {
            type: String
        },
        telephone: {
            type: Number
        },
        address: {
            type: String
        },
        checkSystem:{
            type:Boolean
        },
        checkSms:{
            type:Boolean
        },
        checkEmail:{
            type:Boolean
        },
        latitude:{
            type:Number
        },
        longitude:{
            type:Number
        },
    });



const Salon = module.exports = mongoose.model('Salon', SalonSchema)