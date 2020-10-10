const mongoose = require('mongoose');
const bcrpt = require('bcryptjs');
const config = require('../config/database');

// donor schema
const DonorAppointmentSchema = mongoose.Schema({
    salonEmail: {
        type: String,
        required: true
    },
    DonorRequest:{
        type: Boolean,
        required: true,
    },
    Donoremail: {
        type: String
    },
    customerEmail: {
        type: String
    },
    customerNumber: {
        type: String
    },
    customerName: {
        type: String
    },
    systemRequestDate: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true
    },
    appointmentTimeSlot: {
        type: String,
        required: true
    },
    //1-donor accept 2-donor decline 3-salon accept 4-salon decline 5-?
    progress: {
        type: Number
    },
    canceled: {
        type: Boolean,
        default:false,
        required:true
    },
    endTime: {
        type: String,
        default:'',
    },
    complete: {
        type: Boolean,
        default: false,
        required: true
    }
});


const DonorAppoitment = module.exports = mongoose.model('DonorAppointment', DonorAppointmentSchema)




//Appointment add
module.exports.createAppointment = function (newDonorAppointment, callback) {
    newDonorAppointment.save(callback);
}



//Appointment get by id
module.exports.getById = function (id, callback) {
    DonorAppoitment.findById(id, callback);
}


//update appointment
module.exports.updateAppointment = function (updatedAppointment, callback) {
    DonorAppoitment.findByIdAndUpdate(updatedAppointment._id, {
        $set: updatedAppointment
    }, {
        useFindAndModify: false
    },
        callback);
}


//Appointment delete
module.exports.deleteAppointmentById = function (id, callback) {
    // console.log('dx')
    DonorAppoitment.findByIdAndDelete(id,callback);
}


//Appointment get all
module.exports.getAll = function (callback) {
    DonorAppoitment.find(callback);
}

module.exports.updateTime = function (id ,time,callback) {
    DonorAppoitment.findOneAndUpdate({ _id: id }, {
        $set: {
            appointmentTimeSlot: time
        }
    }, (err, res) => {
        callback(err, res);
    })
}

module.exports.canceleRequest = function (id, callback) {
    DonorAppoitment.findOneAndUpdate({ _id: id }, {
        $set: {
            canceled: true
        }
    }, (err, res) => {
        console.log(res)
        callback(err, res);
    })
}

module.exports.finishRequest = function (id, callback) {
    DonorAppoitment.findOneAndUpdate({ _id: id }, {
        $set: {
            complete: true
        }
    }, (err, res) => {
        callback(err, res);
    })
}

module.exports.updateCloseTime = function (id, startTime, endTime, callback) {
    DonorAppoitment.findOneAndUpdate({ _id: id }, {
        $set: {
            appointmentTimeSlot: startTime,
            endTime: endTime
        }
    }, (err, res) => {
        callback(err, res);
    })
}