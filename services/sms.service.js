const accountSid = 'AC5211e0ef49c00e0af9bfa841f31442ee';
const authToken = '5e7de079fab8871d7dc1fa6030e421af';
const client = require('twilio')(accountSid, authToken);

module.exports = class smsService {

    constructor() {
    }

    async sendMessage(body = "Driver is on the way to your salon for wigs delivery", to ) {

        await client.messages
            .create({body, to, from: '+1 985 241 8068'})

    }

};
