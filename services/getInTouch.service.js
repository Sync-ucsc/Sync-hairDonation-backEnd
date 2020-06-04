const getInTouchModel = require('../models/getInTouch.model');
const  {messageResponse} = require('../utils/chat.utils');

module.exports = class chatService {

    constructor() {

    }

    async addOne(data) {
        try {
            const message = new getInTouchModel(data);
            return await message.save();
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await getInTouchModel.find();
        } catch (error) {
            throw error;
        }
    }

    async getOne({id}) {
        try {

            if(!id) throw 'id not found';
            return await getInTouchModel.findById(id);

        } catch (error) {
            throw error;
        }
    }

    async removeById({id}) {
        try {
            return await getInTouchModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }


    async removeAll() {
        try {
            return await getInTouchModel.remove({});
        } catch (error) {
            throw error;
        }
    }

};
