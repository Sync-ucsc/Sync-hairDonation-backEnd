const nodemailer = require("nodemailer");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const details = {
    email: "akavindula@gmail.com",
    password: "aka-1234"
};



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
        console.log(`pass1`)
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: details.email,
                pass: details.password
            }
        });
        console.log(`pass2`)
        let mailOptions = {
            from: user.email, // sender address
            to: "akavindula@gmail.com", // list of receivers
            subject: `GetInTouch ${user.subject}`, // Subject line
            html: `
                 From: ${user.email}<br>
                 Name: ${user.name}<br>
                <p>${user.message}<p>`
        };
        console.log(`pass3`)
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
            html: `<h1 style='text-align: center'>Welcome to Sync <br><br></h1>
                < p > visit this link
                for verification http://localhost:4200/register-password?email=${user.email}&token=${token}</>`
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
            html: `<h1 style='text-align: center'>Welcome to Sync <br><br></h1>
                < p > visit this link for verification http://localhost:4200/donor-active?id=${user._id}&email=${user.email}</>`
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
            html: `<h1 style='text-align: center'>Welcome to Sync <br><br></h1>
                <p>your token is ${token}</p>`
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

    async sendmailwebfrogetpassword(user, callback) {
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
            from: '"from Tea Truth "<teatruth@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "registation for web app", // Subject line
            html: `<h1 style='text-align: center'>Welcome to Tea Truth <br><br> <img src='https://i.ibb.co/1v6XfQV/favicon.jpg' style='width: 20px; height: 20px; margin: 20 %; margin - top: 8 %;'/></h1>
    <p>visit this link for resetpassword https://teatruth-8083d.web.app/registaition?Token=${user.token}</p>`
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        callback(info);
    }


};
