const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

const NotificationSchema = mongoose.Schema({
    massage: {
        type: String,
        required: true
    },
    notificationStatus: {
        type: String,
        required: true
    },
    groupID: {
        type: String,
    },
    title: {
        type: String,
    },
    icon: {
        type: String,
    },
    role: {
        type: String,
        required: true

    },
    validDate: {
        type: Date
    }


});

const Notification = module.exports = mongoose.model('Notification', NotificationSchema);

//notification add
module.exports.addNotification = function (newNotification, callback) {

    newNotification.save(callback);
}

//Notification edit
module.exports.editNotification = function (newNotification, callback) {


    Notification.findByIdAndUpdate(newNotification._id, {
        $set: newNotification
    }, {
        useFindAndModify: false
    },
    callback);
}

//notification get by id
module.exports.getById = function (id, callback) {

    Notification.findById(id, callback);
}

//notification get all
module.exports.getAll = function (callback) {
    
    Notification.find(callback);
}

//Notification delet all
module.exports.deleteNotificationAll = function (callback) {

    Notification.remove({},callback);
}

//Notification delete
module.exports.deleteNotificationById = function (id, callback) {
    Notification.findByIdAndUpdate(id, { notificationStatus: '0'},callback);
}