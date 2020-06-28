const express = require('express');
const app = express();
const managerRoute = express.Router();


// Manager model
let Manager = require('../models/manager');
let User=require('../models/user');

// Add a Manager
managerRoute.route('/create').post((req, res, next) => {
    const io = req.app.get('io');
    let newManager = new Manager({
        firstName: req.body.firstName,
        lastName:req.body.lastName,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        
    });
    console.log(newManager);
    let user = User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: 'manager',
        email: req.body.email,
    })

    User.register(user, (err, user) => {
        if (err) {
            res.json({
                data: '',
                success: false,
                msg: 'Failed to register user'
            })
        } else {
            Manager.addManager(newManager, (err, salon) => {
                if (err) {
                    res.json({
                        data: err,
                        success: false,
                        msg: 'Failed to add manager'
                    })
                } else {
                    res.json({
                        data: {
                            user: user,
                            salon: salon
                        },
                        success: true,
                        msg: 'Manager Added',
                    })
                    io.emit('new-manager');
                }
            })
        }
    })
})


// Get All Managers
managerRoute.route('/').get((req, res) => {
    const io = req.app.get('io');
    Manager.getAll((err, manager) => {
        if (err) {
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get managers'
            })
        } else {
            res.json({
                data: manager,
                success: true,
                msg: 'got managers',
            })
        }
    })
})



// Get a single manager
managerRoute.get('/read/:id', (req, res) => {
    const io = req.app.get('io');
    Manager.getById(req.params.id, (err, manager) => {
        if (err) {
            res.json({
                data: '',
                success: false,
                msg: 'Failed to get the manager'
            })
        } else {
            res.json({
                data: manager,
                success: true,
                msg: 'got the manager',
            })
        }
    })
})


// Update manager
managerRoute.post('/update/:id', (req, res) => {
    const io = req.app.get('io');
    let updatedManager = Manager({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        
    })

    Manager.updateManager(updatedManager, (err, manager) => {
        if (err) {
            res.json({
                data: err,
                success: false,
                msg: 'Failed to update manager'
            })
        } else {
            res.json({
                data: manager,
                success: true,
                msg: 'updated manager',
            })
            io.emit('update-manager');

        }


    })


})

// Delete a manager
managerRoute.delete('/delete/:id', (req, res) => {
    const io = req.app.get('io');
    console.log(req.params.id)

    Manager.deleteManager(req.params.id, (err, manager) => {
        if (err) {
            res.json({
                data: err,
                success: false,
                msg: 'Failed to delete the manager'
            })
        } else {
            res.json({
                data: manager,
                success: true,
                msg: 'manager deleted',
            })
            io.emit('delete-manager');
        }
    });

})

module.exports = managerRoute;