const DonationSchema = require('../models/payment.model');

module.exports = class PaymentService {

    constructor() {
        this.RETURN_URL = '';
        this.CANCEL_URL = '';
        this.NOTIFY_URL = '';
        this.MERCHANT_ID = '';
    }

    // async createPayment(paymentDetails){
    //
    //     try{
    //         const {
    //             firstName,
    //             lastName,
    //             amount,
    //             email,
    //             phoneNumber,
    //             address,
    //         } = paymentDetails;
    //
    //         // hash = strtoupper (md5 ( firstName . $order_id . $payhere_amount . $payhere_currency . strtoupper(md5($payhere_secret)) ) )
    //
    //         const payHereData = {
    //             "sandbox": true,
    //             "merchant_id": this.MERCHANT_ID,
    //             "return_url": this.RETURN_URL,
    //             "cancel_url": this.CANCEL_URL,
    //             "notify_url": this.NOTIFY_URL,
    //             "order_id": "ItemNo12345",
    //             "items": `Donation from ${firstName} ${lastName}`,
    //             "amount": amount,
    //             "currency": "LKR",
    //             "first_name": firstName,
    //             "last_name": lastName,
    //             "email": email,
    //             "phone": phoneNumber,
    //             "address": address,
    //         };
    //
    //         await this.addNewDonationToDb({
    //             name: payHereData.first_name.toString()
    //                 .concat(" ")
    //                 .concat(payHereData.last_name),
    //             order_id:payHereData.order_id,
    //             email:payHereData.email,
    //             address:payHereData.address,
    //             phone:payHereData.phone,
    //             amount: payHereData.amount,
    //         })
    //
    //     }catch (error) {
    //         throw error
    //     }
    //
    //
    // }

    async addNewDonationToDb(donationData){
        try{

            const donation = new DonationSchema(donationData);
            return await donation.save();

        }catch (error) {
            throw error
        }
    }

    async getAllRequest(donationData){
        try{

            return await DonationSchema.find({});

        }catch (error) {
            throw error
        }
    }

};
