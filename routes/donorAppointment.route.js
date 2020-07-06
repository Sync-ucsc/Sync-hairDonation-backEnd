const express = require('express');
const router = express.Router();


// Appointment model
let DonorAppointment = require('../models/donorAppointment');

// Add a normal customerAppointment
router.route('/create').post((req, res, next) => {
    const io = req.app.get('io');
    let newDonorAppointment = new DonorAppointment({
      SalonEmail: req.body.salonEmail,
      DonorRequest: req.body.DonorRequest,
      Donoremail:req.body.Donoremail,
      customerEmail:req.body.customerEmail,
      customerNumber:req.body.customerNumber,
      customerName:req.body.customerName,
      systemRequestDate:req.body.systemRequestDate,
      appointmentDate:req.body.appointmentDate,
      appointmentTimeSlot:req.body.appointmentTimeSlot
    });
    console.log(new DonorAppointment);
    DonorAppointment.createAppointment(DonorAppointment, (err,donor ) => {
      if (err) {
        res.status(500);
        res.json({
          data: err,
          success: false,
          msg: 'Failed to create the appointment'
        })
      } else {
        res.json({
          data: donor,
          success: true,
          msg: 'Create Appointment',
        })
        io.emit('Create Appointment');
      }
    });
  

    // let user = User({
    //   firstName: req.body.name,
    //   lastName: '',
    //   role: 'donor',
    // })
     
    
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

router.get('/getAll', (req, res) => {
  
  DonorAppointment.getAll((err, donor) => {
    if (err) {
      res.status(500);
      res.json({
        data: '',
        success: false,
        msg: 'Failed to get donors appointment'
      })
    } else {
      res.json({
        data: donor,
        success: true,
        msg: 'got donors appointment',
      })
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