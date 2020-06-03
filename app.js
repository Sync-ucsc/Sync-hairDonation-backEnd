const express = require('express');
const path = require('path');
const bodyprser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')

//socket.io
const socketIo = require('socket.io');
const http = require('http');


// conect database
mongoose.connect(config.database);

mongoose.connection.on('connected', () =>{
    console.log('connected to database'+ config.database);
})

mongoose.connection.on('erorr', (err) => {
    console.log('erorr');
})

const app = express();

const donor = require('./routes/donor');
const user = require('./routes/users');
const salon = require('./routes/salon.route');
const chat = require('./routes/chatRoute');

const port = 3000;


//cors middlware
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

//bodypreser middlware
app.use(bodyprser.json());

//passport middlware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/donor',donor);
app.use('/user', user);
app.use('/salon',salon);
app.use('/chat', chat);

app.get('/', (req,res) => {
    res.send('hi');
})

app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

const server = app.listen(port ,() =>{
    console.log("server start on "+port);
});

var io = require('socket.io').listen(server);
app.set('io', io);

