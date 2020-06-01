const express = require('express');
const app = express();
const salonRoute = express.Router();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Salon model
let Salon = require('../models/salons');

server.listen(3000/salon);




// socket io
io.on('connection', function (socket) {
  socket.on('newdata', function (data) {
      io.emit('new-data', { data: data });
  });
  socket.on('updatedata', function (data) {
    io.emit('update-data', { data: data });
  });
});

// Add a Salon
salonRoute.route('/create').post((req, res, next) => {
  const io = req.app.get('io');
  console.log(io);
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
  const io = req.app.get('io');
  console.log(io);
  console.log('ss')
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
  console.log(io);
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
  console.log(io);
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
salonRoute.route('/delete/:id').delete((req, res, next) => {
  const io = req.app.get('io');
  console.log(io);
  console.log('dd')
  Salon.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
      
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = salonRoute;