const express = require('express');
const app = express();
const salonRoute = express.Router();


// Salon model
let Salon = require('../models/salons');

// Add a Salon
salonRoute.route('/create').post((req, res, next) => {
  const io = req.app.get('io');
  let salon = new Salon({
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
  salon.save().then(() => {
    io.emit('new-salon');
  });
});

// Get All Salons
salonRoute.route('/').get((req, res) => {

  const io = req.app.get('io');
  
  Salon.find((error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single salon
salonRoute.route('/read/:id').get((req, res) => {
  const io = req.app.get('io');
  
  Salon.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update salon
salonRoute.route('/update/:id').put((req, res, next) => {
  const io = req.app.get('io');
  
  Salon.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  }).then(() => {
    io.emit('update-salon');
  })
})

// Delete salon
salonRoute.route('/delete/:id').delete((req, res, next) => {
  const io = req.app.get('io');
  
  console.log('dd')
  Salon.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      console.log(error)
      return next(error);
      
    } else {
      res.status(200).json({
        msg: data
      })
    }
  }).then(() => {
    io.emit('delete-salon');
  })
})

module.exports = salonRoute;