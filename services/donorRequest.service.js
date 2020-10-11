const Donor = require(`../models/donor`);
const DonorRequest = require(`../models/donorRequest.model`)

const SharedService = require(`../services/shared.service`);
const sharedService = new SharedService();

module.exports = class donorRequestService {

    constructor() {
    }
    async updateDonorRequestStatus(data, requestId) {
        try {
            console.log("uhfjbfj");
            if (data.canceled) {
                return await Donor.update(
                    {'request._id': requestId},
                    {'$set': {'request.$.canceled': true}}
                )
            }
            if (data.finished) {
                return await Donor.update(
                    {'request._id': requestId},
                    {'$set': {'request.$.finished': true}}
                )
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }
};