const express = require('express');
const app = express();
const salonRoute = express.Router();

// Salon model
let Salon = require('../models/salons');

// Add a Salon
salonRoute.route('/create').post((req, res, next) => {
  Salon.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Salons
salonRoute.route('/').get((req, res) => {
  Salon.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single salon
salonRoute.route('/read/:id').get((req, res) => {
  Salon.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update salon
salonRoute.route('/update/id').put((req, res, next) => {
  Salon.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete salon
salonRoute.route('/delete/id').delete((req, res, next) => {
  Salon.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = salonRoute;