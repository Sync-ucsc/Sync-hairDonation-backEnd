const {targets, targetSalonLocations} = require('../models/targets.model');
const Salon = require('../models/salons');
const NeedToDeliver = require('../models/NeedToDeliverSchema');

const SharedService = require(`../services/shared.service`);
const sharedService = new SharedService();


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

    async addNewTargetToTargets(targetData, driverEmail) {
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

    async changeTargetStatus({status}, targetId) {
        try {
            return await targets.findByIdAndUpdate(
                {_id: targetId},
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

    async getSalonNeedToDelivers(salonId) {
        try{

            return await Salon
                .findById(sharedService.castToObjectId(salonId))

        }catch (error) {
            throw error
        }
    }
    
    async addNewDeliveryToSalon(salonId){
        try{
            const NeedToDeliverObject = new NeedToDeliver();
            return await Salon.findOneAndUpdate(
                {_id: salonId},
                {$push: {NeedToDeliverStatus: NeedToDeliverObject}}
            )
        }catch (error) {
            throw error
        }
    }

    async updateNeedToDeliverStatus(data) {
        try {
            return await Salon.update(
                {'NeedToDeliverStatus._id': data.deliverId},
                {'$set': {'NeedToDeliverStatus.$.status': data.status}}
            )
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

    async removeTargetById({id}) {
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
