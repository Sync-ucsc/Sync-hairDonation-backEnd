const mongoose = require(`mongoose`)

module.exports = class SharedService {

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
     * this will cast id to Object id
     * @param id
     */
    castToObjectId(id){
        return mongoose.Types.ObjectId(id, undefined)
    }


    /**
     * return full name of a user by concatenating firstName and lastName
     * @param userDetails user document
     * @return {string}
     */
    getFullUserName(userDetails){
        return userDetails.firstName.toString()
            .concat(" ")
            .concat(userDetails.lastName.toString());
    }

};
