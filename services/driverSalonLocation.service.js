const driverSalonLocation = require('../models/driverSalonLocation.model');
const Salon = require('../models/salons');
const NeedToDeliver = require('../models/NeedToDeliverSchema');

module.exports = class chatService {

    constructor() {

    }


    async addOne(data) {
        try {
            const DriverSalonLocation = new driverSalonLocation(data);
            return await DriverSalonLocation.save();
        } catch (error) {
            throw error;
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
                throw new Error(`parameters not found`)
            }
        } catch (error) {
            throw error
        }
    }
};
