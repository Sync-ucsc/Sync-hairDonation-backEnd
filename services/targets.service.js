const {targets, targetSalonLocations} = require('../models/targets.model');
const Salon = require('../models/salons');
const NeedToDeliver = require('../models/NeedToDeliverSchema');

const SharedService = require(`../services/shared.service`);
const sharedService = new SharedService();

module.exports = class targetService {

    constructor() {

    }

    /**
     * assign target for driver
     * @param data
     * @returns {Promise<any>}
     */
    async addTargetToDriver(data) {
        try {
            const DriverSalonLocation = new targets(data);
            return await DriverSalonLocation.save();
        } catch (error) {
            throw error;
        }
    }

    /**
     * assign new salon for target
     * @param targetData
     * @param driverEmail
     * @returns {Promise<*>}
     */
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

    /**
     * change status of a target
     * @param status
     * @param targetId
     * @returns {Promise<*>}
     */
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

    /**
     *  change salon deliver request status and targets document target array status
         NeedToDeliverStatus =  NeedToDeliver | Delivered | Cancel
         target.status = NOT_COMPLETED | COMPLETED,
     * @param status
     * @param requestId
     * @returns {Promise<unknown[]>}
     */
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

    /**
     * get all targets of a driver by driverEmail
     * @param driverEmail
     * @param status NOT_COMPLETED | COMPLETED
     * @returns {Promise<*>}
     */
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

    /**
     * get all targets of a driver by driverEmail and status
     * @param driverEmail
     * @param status
     * @returns {Promise<*>}
     */
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

    /**
     *  get All salons
     * @returns {Promise<*>}
     */
    async getAllSalon() {
        try {
            return await Salon.find()
        } catch (error) {
            throw error
        }
    }

    /**
     * get all salon need to deliver status request
     * @returns {Promise<*>}
     */
    async getAllSalonNeedToDelivers() {
        try{

            const allSalons = await this.getAllSalon()

            return allSalons.map(r => {

                const needToDeliver = r.NeedToDeliverStatus.length > 0 ?
                    r.NeedToDeliverStatus.filter(target => target.status.toString() === `NeedToDeliver`)[0] : null

                const status = needToDeliver ? needToDeliver.status : `not-found`
                const createdAt = needToDeliver ? needToDeliver.createdAt : null

                return {
                    status,
                    createdAt,
                    address: r.address,
                    salonId: r._id,
                    salonEmail: r.email,
                    salonName: r.name,
                    lat: r.latitude,
                    lng: r.longitude,
                }

            }).filter(r => r.status !== `not-found`)
        }catch (error) {
            throw error
        }
    }

    /**
     * get salon need to delivers
     * @param salonId
     * @return {Promise<*[]|
     * {salonId: *,
     * createdAt: {default, type: DateConstructor, required: boolean},
     * address: *, lng: *, salonName: *, requestId: *, deliveryDate, salonEmail: *, lat: *,
     * status: {default: string, type: StringConstructor, required: boolean}}[]>}
     */
    async getSalonNeedToDelivers(salonId) {
        try{

            const salon = await Salon
                .findById(sharedService.castToObjectId(salonId))

            if(salon.NeedToDeliverStatus.length === 0) return [];

            return  salon.NeedToDeliverStatus.map( r => {
                return {
                    requestId: r._id,
                    address: salon.address,
                    salonId: salon._id,
                    salonEmail: salon.email,
                    salonName: salon.name,
                    lat: salon.latitude,
                    lng: salon.longitude,
                    status: r.status,
                    createdAt: r.createdAt,
                    deliveryDate: r.deliveryDate
                }
            }).sort((a,b) => sharedService.sortByDate(a.createdAt,b.createdAt))

        }catch (error) {
            throw error
        }
    }

    /**
     * add new delivery to salon
     * @param salonId
     * @returns {Promise<*>}
     */
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

    /**
     * update need to deliver status of salon
     * @param data
     * @returns {Promise<*>}
     */
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
