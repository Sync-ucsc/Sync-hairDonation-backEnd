const Patient = require(`../models/patient`);
const manualRequest = require(`../models/manualRequest`)

const SharedService = require(`../services/shared.service`);
const sharedService = new SharedService();

module.exports = class manualRequestService {

    constructor() {
    }

    //add wigrequest
    async addWigRequest(data, patientEmail) {
        try {

            const WigRequestObject = new manualRequest(data);

            return await Patient.findOneAndUpdate(
                {id: patientreportId},
                {$push: {request: WigRequestObject}}
            )

        } catch (error) {
            throw error
        }
    }

    
    

    //Get all patients
    async getAllPatients() {
        try {
            return await Patient.find()
        } catch (error) {
            throw error
        }
    }

};
