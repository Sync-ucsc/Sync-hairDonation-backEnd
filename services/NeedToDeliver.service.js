const Salon = require(`../models/salons`);
const NeedToDeliver = require(`../models/NeedToDeliverSchema`)

const SharedService = require(`../services/shared.service`);
const sharedService = new SharedService();

module.exports = class NeedToDeliverService {

    constructor() {
    }

        //add needtodelivery
        async addNeedtodeliver(data, salonEmail) {
            try {
    
                const NeedToDeliverObject = new NeedToDeliver(data);
    
                return await Salon.findOneAndUpdate(
                    {email: salonEmail},
                    {$push: {NeedToDeliverStatus: NeedToDeliverObject}}
                )
    
            } catch (error) {
                throw error
            }
        }
        //update need to deliver array
        async updateWigCount(data, requestId,wigcount) {
            try {
                console.log('update')
                return await Salon.update(
                    {'NeedToDeliverStatus._id': requestId},
                    {'$set': {'NeedToDeliverStatus.$.wigCount':wigcount }}
                )
            }catch (error) {
                console.log(error);
                throw error
            }
        }

};