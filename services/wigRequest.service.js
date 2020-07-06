const Patient = require(`../models/patient`);
const WigRequest = require(`../models/wigRequest.model`)

const SharedService = require(`../services/shared.service`);
const sharedService = new SharedService();

module.exports = class wigRequestService {

    constructor() {
    }


    async addWigRequest(data, patientId) {
        try {

            const WigRequestObject = new WigRequest(data);

            return await Patient.findOneAndUpdate(
                {_id: patientId},
                {$push: {request: WigRequestObject}}
            )

        } catch (error) {
            throw error
        }
    }

    async updateWigRequestStatus(data, requestId) {
        try {
            console.log("uhfjbfj");
            if (data.canceled) {
                return await Patient.update(
                    {'request._id': requestId},
                    {'$set': {'request.$.canceled': true}}
                )
            }
            if (data.finished) {
                return await Patient.update(
                    {'request._id': requestId},
                    {'$set': {'request.$.finished': true}}
                )
            }
            if (data.attendantStatus==1) {
                console.log("uhfjbfj");
                return await Patient.updateOne(
                    {'request._id': requestId},
                    {'$set': {'request.$.attendantStatus': 1}}
                )
            }
            if (data.attendantStatus==2) {
                return await Patient.update(
                    {'request._id': requestId},
                    {'$set': {'request.$.attendantStatus': 2}}
                )
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getLastRequestData(patientId) {
        try {
            const result = await Patient.findById(patientId);

            return result.request
                .sort((a, b) => sharedService.sortByDate(a.requestDay, b.requestDay))[0];

        } catch (error) {
            throw error
        }
    }

    // for testing


    // Patient
    async getAllPatients() {
        try {
            return await Patient.find()
        } catch (error) {
            throw error
        }
    }

};
