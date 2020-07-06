const mongoose = require(`mongoose`)

module.exports = class sharedService {

    constructor() {
    }

    /**
     * @param givenDate01
     * @param givenDate02
     * @returns {number}
     */
    sortByDate(givenDate01, givenDate02){

        const date01 = new Date(givenDate01);
        const date02 = new Date(givenDate02);

        if (date01 < date02) {
            return 1
        } else if (date01 > date02) {
            return -1
        } else {
            return 0
        }

    }

    /**
     * @param id
     */
    castToObjectId(id){
        return mongoose.Types.ObjectId(id, undefined)
    }
};
