const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);

module.exports = class smsService {

    constructor() {
    }

    async sendMessage(body = "Driver is on the way to your salon for wigs delivery", to ) {

        await client.messages
            .create({body, to, from: ''})

    }

};
