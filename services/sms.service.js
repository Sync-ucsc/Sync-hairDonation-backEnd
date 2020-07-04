const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);

module.exports = class smsService {

    constructor() {
    }

    async sendMessage(body = "This is test message", to ) {

        await client.messages
            .create({body, to, from: ''})

    }

};
