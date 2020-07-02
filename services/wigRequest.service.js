const Patient = require(`../models/patient`);
const WigRequest = require(`../models/wigRequest.model`)

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
        } catch (error) {
            throw error
        }
    }

    async getLastRequestData(patientId) {
        try {
            const result = await Patient.findById(patientId);
            return result.request.sort((a, b) => {

                const date01 = new Date(a.requestDay)
                const date02 = new Date(b.requestDay)

                if (date01 < date02) {
                    return 1
                } else if (date01 > date02) {
                    return -1
                } else {
                    return 0
                }

            })[0];
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
