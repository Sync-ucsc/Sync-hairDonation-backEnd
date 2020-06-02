const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define collection and schema
let Salon = new Schema({
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
    }, 
    {
        collection: 'Salons'
    })
module.exports = mongoose.model('Salon', Salon)