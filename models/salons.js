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
            type: String
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
        NeedToDeliverStatus: [{
            status: {
                type: String,
                default: 'NeedToDeliver', // NeedToDeliver | Delivered  | Cancel
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                required: true
            },
            deliveryDate: {
                type: Date,
                default: Date.now(),
                required: true
            }
        }]
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

//salon Location cahnge
module.exports.changeLocation = function (lat, lon, email, callback) {


    Salon.findOneAndUpdate({
        email: email
    }, {
        $set: {
            lat: lat,
            lon: lon
        }
    }, (err, res) => {
        // console.log(res)
        callback(null, null);
    });
}

//salon get by email
module.exports.getSalonByEmail = function (email, callback) {
    const query = {
        email: email
    };
    Salon.findOne(query, callback);
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

module.exports.profileChange = function (email, firstName, lastName, phone, img, address, callback) {
    Salon.findOneAndUpdate({ email: email }, {
        $set: {
            name: firstName,
            telephone: phone,
            address: address
        }
    }, (err, res) => {
        console.log(res)
        callback(err, res);
    })
}