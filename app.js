const express = require('express');
const path = require('path');
const bodyprser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')


// conect database
mongoose.connect(config.database);

mongoose.connection.on('connected', () =>{
    console.log('connected to database'+ config.database);
})

mongoose.connection.on('erorr', (err) => {
    console.log('erorr');
})

const app = express();

const users = require('./routes/users');

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

app.use('/users',users);

app.get('/', (req,res) => {
    res.send('hi');
})

app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

app.listen(port ,() =>{
    console.log("server start on "+port);
})