const nodemailer = require("nodemailer");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const details = require("./details.json");

module.exports = class EmailService {

    constructor() {}

    // app.post("/sendmailManagerRegistation", (req, res) => {
    //     console.log("request came");
    //     let user = req.body;
    //     sendmailManagerRegistation(user, info => {
    //         console.log(`The mail has beed send`);
    //         res.send(info);
    //     });
    // });

    async sendContactUs(user) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: details.email,
                pass: details.password
            }
        });
        let mailOptions = {
            from: user.email, // sender address
            to: "akavindula@gmail.com", // list of receivers
            subject: `GetInTouch ${user.subject}`, // Subject line
            html: `
                 From: ${user.email}<br>
                 Name: ${user.name}<br>
                <p>${user.message}<p>`
        };
        // send mail with defined transport object
        return  await transporter.sendMail(mailOptions);

    }


    async sendmailRegistation(user,token, callback) {
        console.log(user)
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions = {
            from: '<akavindula@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "registation for web app", // Subject line
            html: `<h1 style='text-align: center'>Welcome to 
                                    <img src="https://i.ibb.co/k5scTH9/logo.png"
                                    style="max-height:100px"
                                    alt>
                                 <br><br></h1>
                <p> visit this link
                for verification http://localhost:4200/register-password?email=${user.email}&token=${token}</p>`
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        callback(info);
    }

    async sendmailPatientVerification(user, callback) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions = {
            from: '<akavindula@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "Patient Account Confirmation-Sync", // Subject line
            html: `<h1 style='text-align: center'>Welcome to 
                                    <img src="https://i.ibb.co/k5scTH9/logo.png"
                                    style="max-height:100px"
                                    alt>
                                 <br><br></h1>
                <p> Your account is varified by the hospital. Yourpatient account is activated now. You can log in to the account.</p>`
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        callback(info);
    }

    async sendmailDonorRegistation(user, callback) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions = {
            from: '<akavindula@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "Donor verification for web app", // Subject line
            html: `<h1 style='text-align: center'>Welcome to 
                                    <img src="https://i.ibb.co/k5scTH9/logo.png"
                                    style="max-height:100px"
                                    alt>
                                 <br><br></h1>
                <p> visit this link for verification http://localhost:4200/donor-active?id=${user._id}&email=${user.email}</p>`
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        callback(info);
    }

    async sendmailDriverRegistation(user, token, callback) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions = {
            from: '<akavindula@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "Driver verification for web app", // Subject line
            html: `<h1 style='text-align: center'>Welcome to 
                                    <img src="https://i.ibb.co/k5scTH9/logo.png"
                                    style="max-height:100px"
                                    alt>
                                 <br><br></h1>
                                 <p> Your account is activated now.You can now log in with, <br>
                                    Email: ${user.email}<br>
                                    Password: ${token}<br>

                                     Thank You!
               </p>`
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        callback(info);
    }


    // app.post("/sendmailwebfrogetpassword", (req, res) => {
    //     console.log("request came");
    //     let user = req.body;
    //     sendmailwebfrogetpassword(user, info => {
    //         console.log(`The mail has beed send`);
    //         res.send(info);
    //     });
    // });

    async sendmailwebfrogetpassword(email,token, callback) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions = {
            from: '<akavindula@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "registation for web app", // Subject line
            html: `<h1 style='text-align: center'>Welcome to 
                                    <img src="https://i.ibb.co/k5scTH9/logo.png"
                                    style="max-height:100px"
                                    alt>
                                 <br><br></h1>
                <p> visit this link
                for reset password http://localhost:4200/change-password?email=${email}&token=${token}</p>`
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        callback(info);
    }


};
