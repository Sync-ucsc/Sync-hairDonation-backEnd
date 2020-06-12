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
            const data = await getInTouchModel.findById(id);
            if(data){
                return data
            }else {
                throw 'no data found for id';
            }
        } catch (error) {
            throw error;
        }
    }

    async removeById({id}) {
        try {
            const data = await this.getOne({id});
            if(data){
                return await getInTouchModel.findByIdAndDelete(id);
            }else {
                throw 'no data found for id';
            }
        } catch (error) {

            console.log(error)
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
