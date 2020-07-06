const express = require('express');
const router = express.Router();

const donorAppointmentService = require('../services/donorAppointment.service');
const donorAppointmentService = new donorAppointmentService();

// Appointment model
let DonorAppointment = require('../models/donorAppointment');

// Add a donorAppointment
router.route('/create').post((req, res, next) => {
    const io = req.app.get('io');
    let newDonorAppointment = new DonorAppointment({
      name: req.body.name,
      telephone: req.body.telephone,
      //time:
      //date:
    });
    console.log(new DonorAppointment);
    let user = User({
      firstName: req.body.name,
      lastName: '',
      role: 'donor',
    })
     
    
  });

// Update Appointment
router.post('/update/:id', (req, res) => {
    const io = req.app.get('io');
    let updatedAppointment = DonorAppointment({
      _id: req.params.id,
      name: req.body.name,
     // date:
      //time:
    })
    Salon.updatedAppointment(updatedAppointment, (err, donorAppointment) => {
        if (err) {
          res.status(500);
          res.json({
            data: err,
            success: false,
            msg: 'Failed to update appointment'
          })
        } else {
          res.json({
            data: salon,
            success: true,
            msg: 'updated appointment',
          })
          io.emit('update-appointment');
    
        }
    
        
      })
    
    
    }) 


// Delete Appointment
router.delete('/delete/:id', (req, res) => {
    const io = req.app.get('io');
    console.log(req.params.id)
  
    DonorAppointment.deleteAppointment(req.params.id, (err, salon) => {
      if (err) {
        res.status(500);
        res.json({
          data: err,
          success: false,
          msg: 'Failed to delete the appointment'
        })
      } else {
        res.json({
          data: salon,
          success: true,
          msg: 'Appointment deleted',
        })
        io.emit('delete-appointment');
      }
    });
  
  })



// error routes
router.get('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match get requests'))
  });
  router.post('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match post requests'))
  });
  router.put('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match get requests'))
  });
  router.delete('*', (_, res) => {
    res.status(404);
    res.send(sendResponse(undefined, false, 'path not match post requests'))
  });
  module.exports = router;