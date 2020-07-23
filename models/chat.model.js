const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    senderRole: {
        type: String,
        // required: true
    },
    receiverRole: {
        type: String,
        // required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
});

const chatModel = module.exports = mongoose.model('Chat', chatSchema);
