const express = require('express');
const app = express();
const router = express.Router();

const {sendResponse} = require('../utils/response.utils');

// Salon model
let Salon = require('../models/salons');
let User = require('../models/user');

// Add a Salon
router.route('/create').post((req, res, next) => {
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
  let user = User({
    firstName: req.body.name,
    lastName: '',
    role: 'salon',
    email: req.body.email,
    telephone: req.body.telephone,
  })
  

  User.register(user, (err, user) => {
    if (err) {
      res.status(500);
      res.json({
        data: '',
        success: false,
        msg: 'Faild to register user'
      })
    } else {
      Salon.addSalon(newSalon, (err, salon) => {
        if (err) {
          res.status(500);
          res.json({
            data: err,
            success: false,
            msg: 'Failed to add salon'
          })
        } else {
          res.json({
            data: {
              user: user,
              salon: salon
            },
            success: true,
            msg: 'Salon Created',
          })
          io.emit('check-user');
          io.emit('new-salon');
        }
      })
    }
  })

  
  
});

// Get All Salons
router.route('/').get((req, res) => {
  const io = req.app.get('io');
  Salon.getAll((err, salon) => {
    if (err) {
      res.status(500);
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
router.get('/read/:id', (req, res) => {
  const io = req.app.get('io');
  Salon.getById(req.params.id, (err, salon) => {
    if (err) {
      res.status(500);
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
router.post('/update/:id', (req, res) => {
  const io = req.app.get('io');
  let updatedSalon = Salon({
    _id: req.params.id,
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

  Salon.updateSalon(updatedSalon, (err, salon) => {
    if (err) {
      res.status(500);
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
router.delete('/delete/:id', (req, res) => {
  const io = req.app.get('io');
  console.log(req.params.id)

  Salon.deleteSalon(req.params.id, (err, salon) => {
    if (err) {
      res.status(500);
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
      io.emit('check-user');
      io.emit('delete-salon');
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