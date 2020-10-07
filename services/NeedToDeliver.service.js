const Salon = require(`../models/salons`);
const NeedToDeliver = require(`../models/NeedToDeliverSchema`)

const SharedService = require(`../services/shared.service`);
const sharedService = new SharedService();

module.exports = class NeedToDeliverService {

    constructor() {
    }

        //update need to deliver array
        async updateneedToDeliverStatus(data, requestId) {
            
        }

};