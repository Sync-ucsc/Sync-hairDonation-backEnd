const {targets, targetSalonLocations} = require('../models/targets.model');
const Salon = require('../models/salons');
const NeedToDeliver = require('../models/NeedToDeliverSchema');
const Driver = require('../models/driver')

const SharedService = require(`../services/shared.service`);
const sharedService = new SharedService();

module.exports = class TargetService {

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

            const previousUnfinished = await targets.findOne({
                    $and : [
                        {'targets.salonId': targetData.salonId},
                        {'targets.status': 'NeedToDeliver'},
                        {'driverEmail': driverEmail},
                        {'status': 'NOT_COMPLETED'}
                    ]})

            if(previousUnfinished){

                return  await targets.findOneAndUpdate({
                    $and : [
                        {'targets.salonId': targetData.salonId},
                        {'targets.status': 'NeedToDeliver'},
                        {'driverEmail': driverEmail},
                        {'status': 'NOT_COMPLETED'}
                    ]}, {$inc: {'targets.$.noOfWigs':  targetData.noOfWigs}})

            }else {

                return await targets.findOneAndUpdate(
                    {driverEmail: driverEmail},
                    {$push: {targets: targetObject}}
                )

            }

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
     * change need to deliver status of salon
     * @param status
     * @param requestId
     * @return {Promise<*>}
     */
    async changeSalonNeedToDeliverStatus(status, requestId) {
        try {
            return await Salon.update(
                {'NeedToDeliverStatus._id': requestId},
                {'$set': {'NeedToDeliverStatus.$.status': status}}
            )

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    /**
     * add new notification message to salon need to deliver
     * @param notification
     * @param requestId
     * @return {Promise<*>}
     */
    async addNewNotificationToSalon(notification, requestId) {
        try {
            return await Salon.update(
                {'NeedToDeliverStatus._id': requestId},
                {'$set': {'NeedToDeliverStatus.$.notification': notification}}
            )
        } catch (error) {
            console.log(error)
            throw error
        }
    }


    /**
     *  change salon deliver request status and targets document target array status
     NeedToDeliverStatus =  NeedToDeliver | Delivered | Cancel
     * @param status
     * @param requestId
     * @param notification
     * @returns {Promise<unknown[]>}
     */
    async changeSalonStatus({status, notification}, requestId) {
        try {

            let promise1;
            let promise2;

            console.log(status)

            // if notification or status not provided
            if (!status && !notification) {
                throw new Error('notification or status not provided')
            }

            // if status not provided  only update notification
            if (notification) {

                // updater notification on targets collection
                promise1 = targets.update(
                    {'targets.requestId': requestId},
                    {
                        '$set': {
                            'targets.$.notification': notification
                        }
                    }
                )
                // updater notification on salon collection
                promise2 = this.addNewNotificationToSalon(notification, requestId);

                // resolve both promises
                return await Promise.all([promise1, promise2]);
            }

            // if notification not provided  only update status
            if (status) {

                // updater status on targets collection
                promise1 = targets.update(
                    {'targets.requestId': requestId},
                    {'$set': {'targets.$.status': status}}
                )

            }

            if(notification && status){
                // if both notification and status provided update target collection
                promise1 = targets.update(
                    {'targets.requestId': requestId},
                    {
                        '$set': {
                            'targets.$.status': status,
                            'targets.$.notification': notification
                        }
                    }
                )

                // update notification on salon collection
                promise2 = this.addNewNotificationToSalon(notification, requestId);
            }

            // update salon need to deliver status
            const promise3 = this
                .changeSalonNeedToDeliverStatus(status, requestId)

            // resolve all promises
            return await Promise.all([promise1, promise2, promise3]);

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

    /**
     * get all targets of a driver by driverEmail
     * @param driverEmail
     * @param status NOT_COMPLETED | COMPLETED
     * @returns {Promise<*>}
     */
    async getAllTargetById(driverEmail, { status }) {
        try {
            if (!status) {
                return await targets.find({ driverEmail: driverEmail })
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
     *  driver by driverEmail and status
     * @param driverEmail
     * @param status
     * @returns {Promise<*>}
     */
    async getNotCompletedTargetById(driverEmail, { status }) {
        try {
            if (!status) {
                return await targets.find({ driverEmail: driverEmail })
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
        try {

            // get all salonDetails
            const allSalons = await this.getAllSalon()

            return allSalons.map(r => {

                /**
                 * check salon contain NeedToDeliverStatus if it not contain return null
                 *  if contain then only get latest NeedToDelivers
                 */
                const needToDeliver = r.NeedToDeliverStatus.length > 0 ?
                    r.NeedToDeliverStatus.filter(target => target.status.toString() === `NeedToDeliver`)[0] : null

                /**
                 * check whether need to deliver null or not and assign value
                 * if needToDeliver is null then set status to `not-found`
                 */
                const status = needToDeliver ? needToDeliver.status : `not-found`
                const createdAt = needToDeliver ? needToDeliver.createdAt : null
                const requestId = needToDeliver ? needToDeliver._id : null
                const wigCount = needToDeliver ? needToDeliver.wigCount : null

                return {
                    status,
                    createdAt,
                    requestId,
                    wigCount,
                    address: r.address,
                    salonId: r._id,
                    salonEmail: r.email,
                    salonName: r.name,
                    lat: r.latitude,
                    lng: r.longitude,
                }
                // if not found need to delivers, then those salon will be filter out
            }).filter(r => r.status !== `not-found`)
        } catch (error) {
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
        try {

            /**
             * get one salonDetails by salonId
             * cast salonId to mongoose ObjectId
             * {@link castToObjectId}
             */
            const salon = await Salon
                .findById(sharedService.castToObjectId(salonId))

            // if not found need to delivers then return empty array
            if (salon.NeedToDeliverStatus.length === 0) return [];

            /**
             * map and organize need to deliver object and
             * sort by Date {@link sortByDate}
             */
            return salon.NeedToDeliverStatus.map(r => {
                return {

                    address: salon.address,
                    salonId: salon._id,
                    salonEmail: salon.email,
                    salonName: salon.name,
                    lat: salon.latitude,
                    lng: salon.longitude,

                    requestId: r._id,
                    status: r.status,
                    createdAt: r.createdAt,
                    deliveryDate: r.deliveryDate

                }
            }).sort((a, b) => sharedService.sortByDate(a.createdAt, b.createdAt))

        } catch (error) {
            throw error
        }
    }

    /**
     * add new delivery to salon
     * @param salonId
     * @returns {Promise<*>}
     */
    async addNewDeliveryToSalon(salonId) {
        try {
            const NeedToDeliverObject = new NeedToDeliver();
            return await Salon.findOneAndUpdate(
                {_id: salonId},
                {$push: {NeedToDeliverStatus: NeedToDeliverObject}}
            )
        } catch (error) {
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

    // driver

    /**
     * get all drivers
     * @return {Promise<*>}
     */
    async getAllDrivers() {
        try {
            return await Driver.find()
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
