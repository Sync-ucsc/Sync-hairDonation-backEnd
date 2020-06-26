const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define collection and schema
const ManagerSchema = new Schema({
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
    
});



const Manager = module.exports = mongoose.model('Manager', ManagerSchema);

//Manager add
module.exports.addManager = function (newManager, callback) {

    newManager.save(callback);
}

//get all Managers
module.exports.getAll = function (callback) {

    Manager.find(callback);
}

//Manager get by id
module.exports.getById = function (id, callback) {

    Manager.findById(id, callback);
}

//update Manager
module.exports.updateManager = function (updatedManager, callback) {

    console.log(updatedManager._id)

    Manager.findByIdAndUpdate(updatedManager._id, {
        $set: updatedManager
    }, {
        useFindAndModify: false
    },
        callback);
}
//salon delete
module.exports.deleteManager = function (id, callback) {
    console.log('deleted a manager')
    Manager.findByIdAndDelete(id, callback);
}