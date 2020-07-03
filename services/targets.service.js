const {targets, targetSalonLocations} = require('../models/targets.model');
const Salon = require('../models/salons');
const NeedToDeliver = require('../models/NeedToDeliverSchema');

module.exports = class targetService {

    constructor() {

    }

    async addTargetToDriver(data) {
        try {
            const DriverSalonLocation = new targets(data);
            return await DriverSalonLocation.save();
        } catch (error) {
            throw error;
        }
    }

    async addNewTargetToDriver(targetData, driverEmail) {
        try {
            const targetObject = new targetSalonLocations(targetData);
            console.log(targetObject)
            return await targets.findOneAndUpdate(
                {driverEmail: driverEmail},
                {$push: {targets: targetObject}}
            )
        } catch (error) {
            throw error
        }
    }

    async changeTargetStatus({status}, jobId) {
        try {
            return await targets.findByIdAndUpdate(
                {_id: jobId},
                {'status': status}
            )
        } catch (error) {
            throw error
        }
    }

    async changeLocationStatus({status}, requestId) {
        try {

            const promise1 = await targets.update(
                {'targets.requestId': requestId},
                {'$set': {'targets.$.status': status}}
            )

            const promise2 = await Salon.update(
                {'NeedToDeliverStatus._id': requestId},
                {'$set': {'NeedToDeliverStatus.$.status': status}}
            )

            return await Promise.all([promise1, promise2]);

        } catch (error) {
            throw error
        }
    }

    async getAllTargetById(driverEmail, {status}) {
        try {
            if (!status) {
                return await targets.find({driverEmail: driverEmail})
            } else {
                return await targets.find({
                    driverEmail: driverEmail,
                    'status': status,
                })
            }
        } catch (error) {
            throw error
        }
    }

    async getNotCompletedTargetById(driverEmail, {status}) {
        try {
            if (!status) {
                return await targets.find({driverEmail: driverEmail})
            } else {
                return await targets.find({
                    driverEmail: driverEmail,
                    'status': status,
                })
            }
        } catch (error) {
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
            return await targets.find();
        } catch (error) {
            throw error;
        }
    }

    async removeById({id}) {
        try {
            return await targets.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }


    async removeAll() {
        try {
            return await targets.remove({});
        } catch (error) {
            throw error;
        }
    }
};
