const {driverSalonLocation, location} = require('../models/driverSalonLocation.model');
const Salon = require('../models/salons');
const NeedToDeliver = require('../models/NeedToDeliverSchema');

module.exports = class chatService {

    constructor() {

    }


    async addJobToDriver(data) {
        try {
            const DriverSalonLocation = new driverSalonLocation(data);
            return await DriverSalonLocation.save();
        } catch (error) {
            throw error;
        }
    }

    async addNewLocationToDriver(locationData, driverId) {
        try {
            const locationObject = new location(locationData);
            return await driverSalonLocation.findOneAndUpdate(
                {_id: driverId},
                {$push: {locations: locationObject}}
            )
        } catch (error) {
            throw error
        }
    }

    async changeLocationStatus(status,driverSalonLocationId){
        try{
            return await driverSalonLocation.findByIdAndUpdate(
                {_id: driverSalonLocationId},
                {'status': status}
            )
        }catch (error) {
            throw error
        }
    }

    async changeJobStatus(status,jobId){
        try{
            return await driverSalonLocation.update(
                {'locations._id': jobId},
                {'$set': {'locations.$.status': status}}
            )
        }catch (error) {
            throw error
        }
    }

    // Salon
    async getAllSalon() {
        try {
            return await Salon.find()
        } catch (error) {
            throw error
        }
    }

    async updateNeedToDeliverStatus(data) {
        try {
            if (!data.status) {
                const NeedToDeliverObject = new NeedToDeliver();
                return await Salon.findOneAndUpdate(
                    {_id: data.salonId},
                    {$push: {NeedToDeliverStatus: NeedToDeliverObject}}
                )
            } else if (data.status && data.deliverId) {
                return await Salon.update(
                    {'NeedToDeliverStatus._id': data.deliverId},
                    {'$set': {'NeedToDeliverStatus.$.status': data.status}}
                )
            } else {
                throw new Error(`invalid parameters`)
            }
        } catch (error) {
            throw error
        }
    }

    // for testing
    async getAll() {
        try {
            return await driverSalonLocation.find();
        } catch (error) {
            throw error;
        }
    }

    async removeById({id}) {
        try {
            return await driverSalonLocation.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }


    async removeAll() {
        try {
            return await driverSalonLocation.remove({});
        } catch (error) {
            throw error;
        }
    }
};
