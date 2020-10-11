const express = require('express');
const path = require('path');
const bodyprser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
var logger = require('morgan');


//socket.io
const socketIo = require('socket.io');
const http = require('http');
const ChatService =  require('./services/chat.service');


// conect database
mongoose.connect(config.database, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.on('connected',() => {
    console.log('connected to database'+ config.database);
})

mongoose.connection.on('erorr', (err) => {
    console.log('erorr');
})

const app = express();

const donor = require('./routes/donor');
const user = require('./routes/users');
const salon = require('./routes/salon.route');
const patient = require('./routes/patient.route');
const notification = require('./routes/notification');
const chat = require('./routes/chat.route');
const payment = require('./routes/payment');
const getInTouch = require('./routes/getInTouch.route');
const manager=require('./routes/manager.route')
const fingerprint = require('./routes/fingerprint');
const ip = require('./routes/ip');
const targets = require('./routes/targets.route');
const wigRequest = require('./routes/wigRequest.route');
const donorRequest = require('./routes/donorRequest.route');
const sms = require('./routes/sms.route');
const attendant = require ('./routes/attendant.route');
const driver = require('./routes/driver.route');
const donorAppointment = require('./routes/donorAppointment.route');
const shortestPath=require('./routes/shortestPath.route');
const selectedDonor = require('./routes/selectedDonor')
const attendantDashboard = require('./routes/attendantDashboard.route')
const NeedToDeliver = require('./routes/NeedToDeliver.route')

const port = process.env.PORT || 3000;

if (app.get('env') === 'production') {
    app.use(logger('combined'));
} else {
    app.use(logger('dev'));
}


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
app.use('/patient',patient);
app.use('/notification', notification);
app.use('/chat', chat);
app.use('/payment', payment);
app.use('/getInTouch', getInTouch);
app.use('/manager',manager);
app.use('/fingerprint', fingerprint);
app.use('/ip', ip);
app.use('/targets', targets);
app.use('/donorAppointment', donorAppointment);
app.use('/wigRequest', wigRequest);
app.use('/donorRequest', donorRequest);
app.use('/sms', sms);
app.use('/attendant', attendant);
app.use('/driver',driver);
app.use('/shortestPath', shortestPath);
app.use('/selectedDonor', selectedDonor);
app.use('/attendantDashboard', attendantDashboard);
app.use('/NeedToDeliver', NeedToDeliver);

app.get('/', (req,res) => {
    res.send('hi');
})

// app.get('*', function (req, res) {
//     res.sendfile('./public/index.html');
// });

const server = app.listen(port ,() =>{
    var host = 'http://' + /*server.address().address*/ '127.0.0.1'+ ':' + server.address().port;
    app.set('host', host);
    console.log("server start on "+port);
    console.log(app.get('env'));
});

var io = require('socket.io').listen(server);

app.set('io', io);
(new ChatService()).checkConnection(io);

// app.use((req,res,next) => {
//     const erorr = new Error('Not found');
//     erorr.status = 404;
//     next(error);
// })

// app.use((error,req,res,next)=> {
//     res.status(error.status || 500);
//     res.json({
//         data: error,
//         success: false,
//         msg: 'path not match requests'
//     })
// })

