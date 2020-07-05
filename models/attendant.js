const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define collection and schema
const AttendantSchema = new Schema({
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
        type: Number
    },
    address: {
        type: String
    },
    
});



const Attendant = module.exports = mongoose.model('Attendant', AttendantSchema);

// Attendant add
module.exports.addAttendant = function (newAttendant, callback) {

    newAttendant.save(callback);
}

//get all Attendant
module.exports.getAll = function (callback) {

    Attendant.find(callback);
}

//Attendant get by id
module.exports.getById = function (id, callback) {

    Attendant.findById(id, callback);
}

//update Attendant
module.exports.updateAttendant = function (updatedAttendant, callback) {

    console.log(updatedAttendant._id)

    Manager.findByIdAndUpdate(updatedAttendant._id, {
        $set: updatedAttendant
    }, {
        useFindAndModify: false
    },
        callback);
}
//Attendant delete
module.exports.deleteAttendant = function (id, callback) {
    console.log('deleted an attendant')
    Attendant.findByIdAndDelete(id, callback);
}