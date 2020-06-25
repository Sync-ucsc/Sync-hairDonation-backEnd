const express = require('express');
const app = express();
const salonRoute = express.Router();


// Salon model
let Salon = require('../models/salons');

// Add a Salon
salonRoute.route('/create').post((req, res, next) => {
  const io = req.app.get('io');
  let newSalon = new Salon({
    name: req.body.name,
    email: req.body.email,
    telephone: req.body.telephone,
    address: req.body.address,
    checkSystem: req.body.checkSystem,
    checkSms: req.body.checkSms,
    checkEmail: req.body.checkEmail,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });
  console.log(newSalon);

  Salon.addSalon(newSalon, (err, salon) => {
    if (err) {
      res.json({
        data: err,
        success: false,
        msg: 'Failed to add salon'
      })
    } else {
      res.json({
        data: salon,
        success: true,
        msg: 'Salon Created',
      })
      io.emit('new-salon');
    }
  })
  
});

// Get All Salons
salonRoute.route('/').get((req, res) => {
  const io = req.app.get('io');
  Salon.getAll((err, salon) => {
    if (err) {
      res.json({
        data: '',
        success: false,
        msg: 'Failed to get salons'
      })
    } else {
      res.json({
        data: salon,
        success: true,
        msg: 'got salons',
      })
    }
  })
})



// Get a single salon
salonRoute.get('/read/:id', (req, res) => {
  const io = req.app.get('io');
  Salon.getById(req.params.id, (err, salon) => {
    if (err) {
      res.json({
        data: '',
        success: false,
        msg: 'Failed to get the salon'
      })
    } else {
      res.json({
        data: salon,
        success: true,
        msg: 'got the salon',
      })
    }
  })
})


// Update salon
salonRoute.post('/update/:id', (req, res) => {
  const io = req.app.get('io');
  let updatedSalon = Salon({
    name: req.body.name,
    email: req.body.email,
    telephone: req.body.telephone,
    address: req.body.address,
    checkSystem: req.body.checkSystem,
    checkSms: req.body.checkSms,
    checkEmail: req.body.checkEmail,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  })

  Salon.findByIdAndUpdate(updatedSalon, (err, salon) => {
    if (err) {
      res.json({
        data: err,
        success: false,
        msg: 'Failed to update salon'
      })
    } else {
      res.json({
        data: salon,
        success: true,
        msg: 'updated salon',
      })
      io.emit('update-salon');

    }

    
  })


})

// Delete salon
salonRoute.delete('/delete/:id', (req, res) => {
  const io = req.app.get('io');
  Salon.findByIdAndDelete(req.params.id, (err, salon) => {
    if (err) {
      res.json({
        data: err,
        success: false,
        msg: 'Failed to delete the salon'
      })
    } else {
      res.json({
        data: salon,
        success: true,
        msg: 'salon deleted',
      })
      io.emit('delete-salon');
    }
  });

})

module.exports = salonRoute;