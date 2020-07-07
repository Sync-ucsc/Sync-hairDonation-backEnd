const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define collection and schema
const DriverSchema = new Schema({
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
    telephone: {
        type: String
    },
    address: {
        type: String
    },
    
});



const Driver = module.exports = mongoose.model('Driver', DriverSchema);

//Driver add
module.exports.addDriver = function (newDriver, callback) {

    newDriver.save(callback);
}

//get all Driver
module.exports.getAll = function (callback) {

    Driver.find(callback);
}

//Driver get by id
module.exports.getById = function (id, callback) {

    Driver.findById(id, callback);
}

//update Driver
module.exports.updateDriver = function (updatedDriver, callback) {

    console.log(updatedDriver._id)

    Driver.findByIdAndUpdate(updatedDriver._id, {
        $set: updatedDriver
    }, {
        useFindAndModify: false
    },
        callback);
}
//Driver delete
module.exports.deleteDriver = function (id, callback) {
    console.log('deleted a driver')
    Driver.findByIdAndDelete(id, callback);
}
