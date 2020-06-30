const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define collection and schema
const SalonSchema = new Schema({
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
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



const Salon = module.exports = mongoose.model('Salon', SalonSchema);

//salon add
module.exports.addSalon = function (newSalon, callback) {

    newSalon.save(callback);
}

//salon get all
module.exports.getAll = function (callback) {

    Salon.find(callback);
}

//salon get by id
module.exports.getById = function (id, callback) {

    Salon.findById(id, callback);
}

//update salon
module.exports.updateSalon = function (updatedSalon, callback) {


    Salon.findByIdAndUpdate(updatedSalon._id, {
        $set: updatedSalon
    }, {
        useFindAndModify: false
    },
        callback);
}
//salon delete
module.exports.deleteSalon = function (id, callback) {
    Salon.findByIdAndDelete(id, callback);
}