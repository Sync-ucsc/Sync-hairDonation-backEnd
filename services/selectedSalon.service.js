const mongoose = require(`mongoose`)
const donor = require('../models/donor')

module.exports = class SharedService {

    constructor() {
    }

    async selectedDonor() {
        try {
            const donors = await donor.find({})
            console.log(donors);
        } catch (error) {
            console.log(error)
        }
    }
};
